import { createClient } from '@supabase/supabase-js'

// Database types
export interface WaitlistEntry {
  id: string
  email: string
  position: number
  created_at: string
  ip_address?: string
  user_agent?: string
  referrer?: string
}

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not configured, falling back to JSON storage')
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Check if Supabase is available
export const isSupabaseConfigured = () => {
  return supabase !== null
}

// Waitlist operations
export async function addToWaitlist(
  email: string,
  metadata?: { ip_address?: string; user_agent?: string; referrer?: string }
): Promise<{ success: boolean; position?: number; error?: string; isExisting?: boolean }> {
  if (!supabase) {
    return { success: false, error: 'Supabase not configured' }
  }

  const normalizedEmail = email.toLowerCase().trim()

  // Check if email already exists
  const { data: existing } = await supabase
    .from('waitlist')
    .select('position')
    .eq('email', normalizedEmail)
    .single()

  if (existing) {
    return { success: true, position: existing.position, isExisting: true }
  }

  // Get the next position number
  const { count } = await supabase
    .from('waitlist')
    .select('*', { count: 'exact', head: true })

  const nextPosition = (count || 0) + 1

  // Insert new entry
  const { error } = await supabase
    .from('waitlist')
    .insert({
      email: normalizedEmail,
      position: nextPosition,
      ip_address: metadata?.ip_address,
      user_agent: metadata?.user_agent,
      referrer: metadata?.referrer,
    })

  if (error) {
    console.error('Supabase insert error:', error)
    return { success: false, error: error.message }
  }

  return { success: true, position: nextPosition }
}

export async function getWaitlistCount(): Promise<number> {
  if (!supabase) {
    return 0
  }

  const { count } = await supabase
    .from('waitlist')
    .select('*', { count: 'exact', head: true })

  return count || 0
}

export async function getWaitlistEntries(limit = 100, offset = 0): Promise<WaitlistEntry[]> {
  if (!supabase) {
    return []
  }

  const { data } = await supabase
    .from('waitlist')
    .select('*')
    .order('position', { ascending: true })
    .range(offset, offset + limit - 1)

  return data || []
}

// ===========================================
// Received Emails Operations
// ===========================================

export interface ReceivedEmail {
  id: string
  email_id: string
  from_address: string
  to_addresses: string[]
  subject: string | null
  html_body: string | null
  text_body: string | null
  has_attachments: boolean
  attachment_count: number
  forwarded_to: string | null
  forwarded_at: string | null
  received_at: string
  created_at: string
}

export interface SaveReceivedEmailParams {
  email_id: string
  from_address: string
  to_addresses: string[]
  subject?: string
  html_body?: string
  text_body?: string
  has_attachments?: boolean
  attachment_count?: number
  forwarded_to?: string
  forwarded_at?: Date
}

export async function saveReceivedEmail(
  params: SaveReceivedEmailParams
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    console.warn('Supabase not configured, skipping email storage')
    return { success: false, error: 'Supabase not configured' }
  }

  const { error } = await supabase.from('received_emails').insert({
    email_id: params.email_id,
    from_address: params.from_address,
    to_addresses: params.to_addresses,
    subject: params.subject || null,
    html_body: params.html_body || null,
    text_body: params.text_body || null,
    has_attachments: params.has_attachments || false,
    attachment_count: params.attachment_count || 0,
    forwarded_to: params.forwarded_to || null,
    forwarded_at: params.forwarded_at?.toISOString() || null,
  })

  if (error) {
    console.error('Failed to save received email:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function getReceivedEmails(
  limit = 50,
  offset = 0
): Promise<ReceivedEmail[]> {
  if (!supabase) {
    return []
  }

  const { data } = await supabase
    .from('received_emails')
    .select('*')
    .order('received_at', { ascending: false })
    .range(offset, offset + limit - 1)

  return data || []
}

export async function getReceivedEmailById(
  emailId: string
): Promise<ReceivedEmail | null> {
  if (!supabase) {
    return null
  }

  const { data } = await supabase
    .from('received_emails')
    .select('*')
    .eq('email_id', emailId)
    .single()

  return data
}
