CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create node table
CREATE TABLE IF NOT EXISTS node (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    name VARCHAR(255) NOT NULL,
    axis_x NUMERIC NOT NULL,
    axis_y NUMERIC NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
-- CREATE INDEX IF NOT EXISTS idx_node_email ON node (email);