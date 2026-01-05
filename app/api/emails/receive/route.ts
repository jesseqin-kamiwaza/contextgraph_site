import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { saveReceivedEmail } from '@/lib/supabase'

// Forward destination
const FORWARD_TO = 'hello@daydayup.co'

// Initialize Resend client
const getResend = () => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY not configured')
  }
  return new Resend(process.env.RESEND_API_KEY)
}

// Webhook payload type from Resend
interface EmailReceivedEvent {
  type: 'email.received'
  created_at: string
  data: {
    email_id: string
    from: string
    to: string[]
    subject: string
    created_at: string
    attachments?: {
      id: string
      filename: string
      content_type: string
    }[]
  }
}

// Email content from Resend API
interface EmailContent {
  html?: string
  text?: string
}

export async function POST(request: NextRequest) {
  try {
    const resend = getResend()

    // Get raw payload for signature verification
    const payload = await request.text()

    // Verify webhook signature (if secret is configured)
    if (process.env.RESEND_WEBHOOK_SECRET) {
      const svixId = request.headers.get('svix-id')
      const svixTimestamp = request.headers.get('svix-timestamp')
      const svixSignature = request.headers.get('svix-signature')

      if (!svixId || !svixTimestamp || !svixSignature) {
        console.error('Missing Svix headers')
        return NextResponse.json({ error: 'Missing signature headers' }, { status: 401 })
      }

      try {
        resend.webhooks.verify({
          payload,
          headers: {
            id: svixId,
            timestamp: svixTimestamp,
            signature: svixSignature,
          },
          webhookSecret: process.env.RESEND_WEBHOOK_SECRET,
        })
      } catch (verifyError) {
        console.error('Webhook verification failed:', verifyError)
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 })
      }
    }

    // Parse the verified payload
    const event = JSON.parse(payload) as EmailReceivedEvent

    // Only process email.received events
    if (event.type !== 'email.received') {
      return NextResponse.json({ message: 'Ignored' }, { status: 200 })
    }

    const { email_id, from, to, subject, attachments } = event.data

    console.log('📧 Received email:', {
      id: email_id,
      from,
      to,
      subject,
      attachmentCount: attachments?.length || 0,
      receivedAt: event.created_at,
    })

    // Fetch the full email content (webhook doesn't include body)
    const emailContent = await fetchEmailContent(resend, email_id)

    // Fetch and prepare attachments if any
    let preparedAttachments: { filename: string; content: string }[] = []
    if (attachments && attachments.length > 0) {
      preparedAttachments = await fetchAttachments(resend, email_id)
    }

    // Forward the email to hello@daydayup.co
    const forwardedAt = new Date()
    await forwardEmail(resend, {
      from,
      to,
      subject,
      html: emailContent?.html,
      text: emailContent?.text,
      attachments: preparedAttachments,
    })

    // Save to Supabase
    await saveReceivedEmail({
      email_id,
      from_address: from,
      to_addresses: to,
      subject,
      html_body: emailContent?.html,
      text_body: emailContent?.text,
      has_attachments: (attachments?.length || 0) > 0,
      attachment_count: attachments?.length || 0,
      forwarded_to: FORWARD_TO,
      forwarded_at: forwardedAt,
    })

    console.log('✅ Email forwarded and saved:', {
      email_id,
      forwarded_to: FORWARD_TO,
    })

    return NextResponse.json({
      success: true,
      message: 'Email forwarded and saved',
      email_id,
      forwarded_to: FORWARD_TO,
    })
  } catch (error) {
    console.error('Email receive error:', error)
    return NextResponse.json(
      { error: 'Failed to process email' },
      { status: 500 }
    )
  }
}

// Fetch full email content from Resend Receiving API
async function fetchEmailContent(
  resend: Resend,
  emailId: string
): Promise<EmailContent | null> {
  try {
    // Use Resend SDK to get email content
    const { data } = await resend.emails.receiving.get(emailId)
    return {
      html: data?.html || undefined,
      text: data?.text || undefined,
    }
  } catch (error) {
    console.error('Failed to fetch email content:', error)
    // Fallback to direct API call
    try {
      const response = await fetch(
        `https://api.resend.com/emails/${emailId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
        }
      )
      if (response.ok) {
        const data = await response.json()
        return { html: data.html, text: data.text }
      }
    } catch (fallbackError) {
      console.error('Fallback fetch also failed:', fallbackError)
    }
    return null
  }
}

// Fetch attachments and convert to base64
async function fetchAttachments(
  resend: Resend,
  emailId: string
): Promise<{ filename: string; content: string }[]> {
  try {
    // Get attachment list via receiving API
    const { data: attachmentList } = await resend.emails.receiving.attachments.list({
      emailId,
    })

    if (!attachmentList?.data || attachmentList.data.length === 0) {
      return []
    }

    const preparedAttachments: { filename: string; content: string }[] = []

    // Download each attachment and convert to base64
    for (const attachment of attachmentList.data) {
      if (attachment.download_url) {
        try {
          const response = await fetch(attachment.download_url)
          const buffer = Buffer.from(await response.arrayBuffer())
          preparedAttachments.push({
            filename: attachment.filename || 'attachment',
            content: buffer.toString('base64'),
          })
        } catch (downloadError) {
          console.error(`Failed to download attachment ${attachment.filename}:`, downloadError)
        }
      }
    }

    return preparedAttachments
  } catch (error) {
    console.error('Failed to fetch attachments:', error)
    return []
  }
}

// Forward the email to hello@daydayup.co
async function forwardEmail(
  resend: Resend,
  email: {
    from: string
    to: string[]
    subject: string
    html?: string
    text?: string
    attachments?: { filename: string; content: string }[]
  }
): Promise<void> {
  try {
    const forwardSubject = `[Fwd] ${email.subject || '(No Subject)'}`

    // Build forwarding header
    const forwardHeader = `
      <div style="margin-bottom: 20px; padding: 15px; background: #f5f5f5; border-left: 4px solid #f97316; font-family: system-ui, sans-serif;">
        <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">
          <strong>Forwarded email from Context Graph</strong>
        </p>
        <p style="margin: 0; color: #333; font-size: 13px;">
          <strong>From:</strong> ${email.from}<br/>
          <strong>To:</strong> ${email.to.join(', ')}<br/>
          <strong>Subject:</strong> ${email.subject || '(No Subject)'}<br/>
          <strong>Date:</strong> ${new Date().toLocaleString()}
        </p>
      </div>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;"/>
    `

    const htmlContent = email.html
      ? forwardHeader + email.html
      : forwardHeader + `<pre style="white-space: pre-wrap;">${email.text || '(No content)'}</pre>`

    await resend.emails.send({
      from: 'Context Graph <hello@contextgraph.tech>',
      to: FORWARD_TO,
      subject: forwardSubject,
      html: htmlContent,
      text: email.text
        ? `--- Forwarded email ---\nFrom: ${email.from}\nTo: ${email.to.join(', ')}\nSubject: ${email.subject}\n\n${email.text}`
        : undefined,
      attachments: email.attachments?.map(att => ({
        filename: att.filename,
        content: att.content,
      })),
    })

    console.log('📤 Email forwarded to:', FORWARD_TO)
  } catch (error) {
    console.error('Failed to forward email:', error)
    throw error
  }
}
