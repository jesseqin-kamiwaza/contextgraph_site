import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { Resend } from 'resend'

// Only initialize Resend if API key is available
const getResend = () => {
  if (!process.env.RESEND_API_KEY) {
    return null
  }
  return new Resend(process.env.RESEND_API_KEY)
}

interface WaitlistData {
  emails: string[]
  count: number
}

async function getWaitlistData(): Promise<WaitlistData> {
  const dataPath = path.join(process.cwd(), 'data', 'waitlist.json')
  try {
    const data = await fs.readFile(dataPath, 'utf-8')
    return JSON.parse(data)
  } catch {
    return { emails: [], count: 0 }
  }
}

async function saveWaitlistData(data: WaitlistData): Promise<void> {
  const dataPath = path.join(process.cwd(), 'data', 'waitlist.json')
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2))
}

async function sendWelcomeEmail(email: string, position: number): Promise<void> {
  const resend = getResend()
  if (!resend) {
    console.log('Skipping email - RESEND_API_KEY not configured')
    return
  }

  try {
    await resend.emails.send({
      from: 'Context Graph <hello@daydayup.co>',
      to: email,
      subject: "You're on the Context Graph waitlist!",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: system-ui, -apple-system, sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px;">
                    <!-- Logo -->
                    <tr>
                      <td align="center" style="padding-bottom: 30px;">
                        <div style="font-size: 24px; font-weight: bold; color: #fafafa;">
                          <span style="color: #fafafa;">Context</span><span style="color: #f97316;">Graph</span>
                        </div>
                      </td>
                    </tr>

                    <!-- Main Content -->
                    <tr>
                      <td style="background-color: #171717; border-radius: 16px; padding: 40px; border: 1px solid #262626;">
                        <h1 style="color: #fafafa; font-size: 28px; margin: 0 0 20px 0; text-align: center;">
                          You're In! 🎉
                        </h1>

                        <p style="color: #a1a1aa; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0; text-align: center;">
                          Thank you for joining the Context Graph waitlist. You're now part of an exclusive group of pioneers shaping the future of AI decision-making.
                        </p>

                        <div style="background-color: #0a0a0a; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center; border: 1px solid #f97316;">
                          <p style="color: #f97316; font-size: 14px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 1px;">
                            Your Waitlist Position
                          </p>
                          <p style="color: #fafafa; font-size: 48px; font-weight: bold; margin: 0;">
                            #${position}
                          </p>
                        </div>

                        <h2 style="color: #fafafa; font-size: 20px; margin: 30px 0 15px 0;">
                          What's Next?
                        </h2>

                        <ul style="color: #a1a1aa; font-size: 14px; line-height: 1.8; padding-left: 20px; margin: 0;">
                          <li>We'll notify you as soon as the marketplace launches</li>
                          <li>Early members get exclusive access to beta features</li>
                          <li>You'll have the opportunity to become a founding contributor</li>
                        </ul>

                        <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; text-align: center;">
                          Have questions? Reply to this email or reach us at <a href="mailto:hello@daydayup.co" style="color: #f97316;">hello@daydayup.co</a>
                        </p>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="padding-top: 30px; text-align: center;">
                        <p style="color: #525252; font-size: 12px; margin: 0;">
                          &copy; ${new Date().getFullYear()} contextgraph.tech. All rights reserved.
                        </p>
                        <p style="color: #525252; font-size: 12px; margin: 10px 0 0 0;">
                          The marketplace for AI decision traces.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    })
  } catch (error) {
    console.error('Failed to send welcome email:', error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Get current data
    const data = await getWaitlistData()

    // Check for duplicates
    if (data.emails.includes(email.toLowerCase())) {
      return NextResponse.json(
        { message: "You're already on the list!", position: data.emails.indexOf(email.toLowerCase()) + 1 },
        { status: 200 }
      )
    }

    // Add new email
    data.emails.push(email.toLowerCase())
    data.count = data.emails.length

    // Save data
    await saveWaitlistData(data)

    // Send welcome email
    await sendWelcomeEmail(email, data.count)

    return NextResponse.json(
      { message: "You're on the list!", position: data.count },
      { status: 201 }
    )
  } catch (error) {
    console.error('Waitlist error:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const data = await getWaitlistData()
    return NextResponse.json({ count: data.count })
  } catch {
    return NextResponse.json({ count: 0 })
  }
}
