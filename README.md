# AmaniCode Solutions Website

## Stack
- Frontend: React 19, TypeScript, Tailwind CSS, and Vite
- Backend: standalone Node.js HTTP API in `backend/server.mjs`
- Database: Neon PostgreSQL through `@neondatabase/serverless`

## Run locally
1. Copy `.env.example` to `.env`, then add your Neon `DATABASE_URL` and private `ADMIN_KEY`.
2. Run `npm run api` to start the Neon API on port `3002`.
3. In another terminal, run `npm run dev` to start the website.

The API creates the `amanicode_records` table automatically. It stores contact leads, website assets, WhatsApp details, project information, and solution links in Neon.

## Database schema

Run [database/schema.sql](database/schema.sql) in the Neon SQL Editor to create the table and its list-query index manually. The SQL matches the API exactly.

For more information, refer to the API documentation.
