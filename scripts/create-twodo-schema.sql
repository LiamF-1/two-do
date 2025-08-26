-- Create the twodo schema in the existing mindline-db database
-- Run this in your PostgreSQL client connected to mindline-db

-- Create the schema
CREATE SCHEMA IF NOT EXISTS twodo;

-- Grant permissions to the doadmin user
GRANT ALL ON SCHEMA twodo TO doadmin;
GRANT ALL ON ALL TABLES IN SCHEMA twodo TO doadmin;
GRANT ALL ON ALL SEQUENCES IN SCHEMA twodo TO doadmin;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA twodo GRANT ALL ON TABLES TO doadmin;
ALTER DEFAULT PRIVILEGES IN SCHEMA twodo GRANT ALL ON SEQUENCES TO doadmin;

-- Verify schema was created
SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'twodo';
