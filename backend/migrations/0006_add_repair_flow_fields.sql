-- Migration: Add repair flow state fields
-- Adds new fields to support 5-state repair flow: pending → agendado → en_reparacion → reparado → completado

ALTER TABLE techfix_repair_orders
ADD COLUMN IF NOT EXISTS part_type VARCHAR(20),
ADD COLUMN IF NOT EXISTS estimated_price_min DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS estimated_price_max DECIMAL(10, 2);

-- Create index for status queries
CREATE INDEX IF NOT EXISTS idx_repair_orders_status ON techfix_repair_orders(status);

-- Create index for user queries
CREATE INDEX IF NOT EXISTS idx_repair_orders_user_id ON techfix_repair_orders(user_id);

-- Ensure Payment table has proper indexing
CREATE INDEX IF NOT EXISTS idx_payments_repair_id ON techfix_payments(repair_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON techfix_payments(status);
