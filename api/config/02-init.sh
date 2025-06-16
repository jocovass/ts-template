#!/bin/bash

# Check the environment and modify pg_hba.conf accordingly
if [ "$POSTGRES_ENV" == "production" ]; then
    echo "Setting production IP rules in pg_hba.conf"
    echo "host all all 192.168.1.0/24 scram-sha-256" >> /var/lib/postgresql/data/pg_hba.conf
else
    echo "Setting local development IP rules in pg_hba.conf"
    echo "host all all 127.0.0.1/32 scram-sha-256" >> /var/lib/postgresql/data/pg_hba.conf
fi

# Update the password for the app_user user
psql -U postgres -c "ALTER ROLE app_user WITH PASSWORD '${POSTGRES_PASSWORD}';"
