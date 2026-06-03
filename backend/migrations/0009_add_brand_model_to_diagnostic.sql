-- Migration: Add brand and model fields to diagnostic sessions
-- Allows tracking of device brand and model for better context

ALTER TABLE techfix_diagnostic_sessions
ADD COLUMN IF NOT EXISTS brand VARCHAR(100),
ADD COLUMN IF NOT EXISTS model VARCHAR(200);

-- Create index for brand queries
CREATE INDEX IF NOT EXISTS idx_diagnostic_sessions_brand ON techfix_diagnostic_sessions(brand);
CREATE INDEX IF NOT EXISTS idx_diagnostic_sessions_model ON techfix_diagnostic_sessions(model);
