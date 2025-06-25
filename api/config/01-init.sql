BEGIN;

-- Read only role
CREATE ROLE app_ro WITH NOLOGIN;
COMMENT ON ROLE app_ro IS 'Read-only access role.';

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT SELECT ON TABLES TO app_ro;

-- Read and write role
CREATE ROLE app_rw WITH NOLOGIN;
COMMENT ON ROLE app_rw IS 'Read and write access role.';

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT EXECUTE ON FUNCTIONS TO app_rw;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO app_rw;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON TABLES TO app_rw;

-- User for the application
-- NOTE: the password will be updated when the DB is initialized
CREATE USER app_user WITH LOGIN PASSWORD 'postgres' BYPASSRLS;
COMMENT ON ROLE app_user IS 'Application user.';

GRANT app_rw TO app_user;
GRANT CREATE ON DATABASE tododb TO app_user;

-- Grant postgres ability to SET ROLE (for RDS)
GRANT app_user TO postgres;

COMMIT;
