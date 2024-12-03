# T3 Reddit Clone - MVP

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## Installation

Install the packages:

```bash
  npm install
```

Set up a local PostgreSQL database with a new user:

```sql
CREATE DATABASE t3_reddit;
CREATE USER t3_reddit_user WITH PASSWORD 'password' CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE t3_reddit TO t3_reddit_user;
\c t3_reddit
ALTER SCHEMA public OWNER TO t3_reddit_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO t3_reddit_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO t3_reddit_user;
```

Create a `.env` file based on `.env.example` and fill in the values, including the local `DATABASE_URL`.

## Prisma

Create a new migration after changing the Prisma schema.
This will generate a new migration file in the `prisma/migrations` directory based on the changes in the schema file `prisma/schema.prisma` and update the database with the new model definitions. In production, the migration is automatically created and applied when a change is pushed to the `main` branch.

```bash
npx prisma migrate dev --name <migration-name>
```

Launch the Prisma Studio to view the data in the database.

```bash
npx prisma studio
```
