# T3 Reddit Clone - MVP

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

Technologies used:

- [Next.js App Router](https://nextjs.org/)
- [tRPC](https://trpc.io/)
- [Prisma](https://prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Neon](https://neon.tech/)
- [Clerk](https://clerk.com/)

## Installation

### Install the packages

```bash
  npm install
```

### Option 1: Local PostgreSQL Database

Set up a local PostgreSQL database with a new user by connecting to the database and running the following commands:

```sql
CREATE DATABASE t3_reddit;
CREATE USER t3_reddit_user WITH PASSWORD 'password' CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE t3_reddit TO t3_reddit_user;
\c t3_reddit
ALTER SCHEMA public OWNER TO t3_reddit_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO t3_reddit_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO t3_reddit_user;
```

The database URL will be in the following format: `postgresql://<username>:<password>@<host>:<port>/<database-name>`

### Option 2: Connect directly to the production database (not recommended during development)

Retrieve the production database URL from the Neon dashboard. Don't forget to enable pooled connections in the database settings.

### Setup your environment variables

Create a `.env` file based on `.env.example` and fill in the values, including the `DATABASE_URL` from either option 1 or 2.

## Prisma

Create a new migration after changing the Prisma schema.
This will generate a new migration file in the `prisma/migrations` directory based on the changes in the schema file `prisma/schema.prisma` and update the database with the new model definitions. In production, the migration is automatically created and applied when a change is pushed to the `main` branch.

```bash
npm run db:generate
```

Launch the Prisma Studio to view the data in the database.

```bash
npm run db:studio
```

## Deployment in Production

This app is deployed to [Vercel](https://vercel.com/) automatically when a push is made to the `master` branch.
A GitHub Action workflow is used to push the new database migrations to the production database.
