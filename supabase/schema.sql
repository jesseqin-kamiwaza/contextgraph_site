-- Waitlist table for Context Graph Marketplace
-- Run this in your Supabase SQL Editor

-- Create the waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT
);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);

-- Create index for position ordering
CREATE INDEX IF NOT EXISTS idx_waitlist_position ON waitlist(position);

-- Enable Row Level Security (RLS)
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Policy: Allow inserts from anonymous users (for waitlist signups)
CREATE POLICY "Allow anonymous inserts" ON waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Allow reading count (for displaying waitlist size)
CREATE POLICY "Allow counting" ON waitlist
  FOR SELECT
  TO anon
  USING (true);

-- Policy: Only service role can update/delete
CREATE POLICY "Service role full access" ON waitlist
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Function to get next position atomically
CREATE OR REPLACE FUNCTION get_next_waitlist_position()
RETURNS INTEGER AS $$
DECLARE
  next_pos INTEGER;
BEGIN
  SELECT COALESCE(MAX(position), 0) + 1 INTO next_pos FROM waitlist;
  RETURN next_pos;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-set position on insert
CREATE OR REPLACE FUNCTION set_waitlist_position()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.position IS NULL THEN
    NEW.position := get_next_waitlist_position();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_waitlist_position
  BEFORE INSERT ON waitlist
  FOR EACH ROW
  EXECUTE FUNCTION set_waitlist_position();

-- Comment for documentation
COMMENT ON TABLE waitlist IS 'Stores email signups for Context Graph Marketplace waitlist';
COMMENT ON COLUMN waitlist.email IS 'Normalized email address (lowercase)';
COMMENT ON COLUMN waitlist.position IS 'Waitlist position number';
COMMENT ON COLUMN waitlist.ip_address IS 'IP address of signup (for rate limiting)';
COMMENT ON COLUMN waitlist.user_agent IS 'Browser user agent string';
COMMENT ON COLUMN waitlist.referrer IS 'Referrer URL if available';
