-- Migration: Add AI Diagnostic System tables
-- Creates tables for AI-driven diagnostic sessions and product recommendations

-- Create diagnostic sessions table (anonymous, no auth required)
CREATE TABLE IF NOT EXISTS techfix_diagnostic_sessions (
    id UUID PRIMARY KEY,
    user_id UUID,
    device_id UUID,
    device_type VARCHAR(50) NOT NULL,
    initial_issue TEXT NOT NULL,
    final_diagnosis TEXT,
    estimated_min_price DECIMAL(10, 2) DEFAULT 0,
    estimated_max_price DECIMAL(10, 2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'in_progress',
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP,
    CONSTRAINT fk_diagnostic_sessions_user FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    CONSTRAINT fk_diagnostic_sessions_device FOREIGN KEY (device_id) REFERENCES techfix_devices(id) ON DELETE SET NULL
);

-- Create diagnostic turns (question-answer pairs)
CREATE TABLE IF NOT EXISTS techfix_diagnostic_turns (
    id UUID PRIMARY KEY,
    diagnostic_session_id UUID NOT NULL,
    question TEXT NOT NULL,
    user_answer TEXT,
    turn_number INT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_diagnostic_turns_session FOREIGN KEY (diagnostic_session_id) REFERENCES techfix_diagnostic_sessions(id) ON DELETE CASCADE
);

-- Create AI recommended products table
CREATE TABLE IF NOT EXISTS techfix_ai_recommended_products (
    id UUID PRIMARY KEY,
    diagnostic_session_id UUID NOT NULL,
    producto_id UUID,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    estimated_price DECIMAL(10, 2),
    ai_reasoning TEXT,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_ai_products_session FOREIGN KEY (diagnostic_session_id) REFERENCES techfix_diagnostic_sessions(id) ON DELETE CASCADE,
    CONSTRAINT fk_ai_products_producto FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_diagnostic_sessions_user_id ON techfix_diagnostic_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_diagnostic_sessions_device_id ON techfix_diagnostic_sessions(device_id);
CREATE INDEX IF NOT EXISTS idx_diagnostic_sessions_status ON techfix_diagnostic_sessions(status);
CREATE INDEX IF NOT EXISTS idx_diagnostic_turns_session_id ON techfix_diagnostic_turns(diagnostic_session_id);
CREATE INDEX IF NOT EXISTS idx_ai_recommended_products_session_id ON techfix_ai_recommended_products(diagnostic_session_id);
CREATE INDEX IF NOT EXISTS idx_ai_recommended_products_producto_id ON techfix_ai_recommended_products(producto_id);
