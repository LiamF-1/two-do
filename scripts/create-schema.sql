-- Create the twodo schema in your PostgreSQL database
-- Run this in your PostgreSQL client before running prisma db:push

-- Connect to your database (replace 'twodo' with your database name if different)
\c twodo;

-- Create the schema
CREATE SCHEMA IF NOT EXISTS twodo;

-- Grant permissions (adjust user as needed)
GRANT ALL ON SCHEMA twodo TO postgres;
GRANT ALL ON ALL TABLES IN SCHEMA twodo TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA twodo TO postgres;

-- Set search path to include the new schema
ALTER DATABASE twodo SET search_path TO twodo, public;

-- Verify schema was created
\dn;

-- Show current search path
SHOW search_path;
