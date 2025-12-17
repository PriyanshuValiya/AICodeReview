# CodeRat : AICodeReviewer

AICodeReview is a developer-focused web application that automates repository analytics and AI-assisted code review workflows. It combines a modern Next.js UI, background job processing, AI retrieval-augmented-generation (RAG) with a vector store, GitHub integrations, subscription billing via Stripe, and a Prisma-backed relational database to provide teams with automated summaries, review suggestions, and searchable repository context.

## Key features

- Automated weekly repository summaries and scheduled review dispatching (background jobs).
- AI-assisted review generation using embeddings + vector search for relevant context.
- GitHub integrations (OAuth / App) and webhook handling for repo events.
- User authentication, repository management and per-user dashboards.
- Subscription billing and checkout flows via Stripe.
- Background processing and event orchestration using Inngest.

## High-level architecture

- Frontend: Next.js (app router) — UI, public pages, and protected dashboard under `app/`.
- API & server: Next.js API routes (under `app/api/`) for webhooks, Stripe endpoints, and server actions.
- Background workers: `inngest/functions/` implements scheduled tasks and async review pipelines.
- Database: Prisma with a relational DB (Postgres recommended) for users, repos, reviews, and subscriptions.
- Vector store: Pinecone (or equivalent) stores embeddings for repository content to enable RAG lookups.
- AI layer: `module/ai/` contains the retrieval + generation pipeline that composes prompts with retrieved context.
- Integrations: GitHub (API + webhooks), Stripe (checkout + webhooks), and an LLM provider (OpenAI or other).

## Tech stack

- Framework: Next.js + TypeScript
- Styling: Tailwind CSS
- ORM: Prisma (Postgres / compatible)
- Vector DB: Pinecone
- Background jobs / orchestration: Inngest
- AI / LLM: Provider configurable via environment (OpenAI, etc.)
- Payments: Stripe

## Repository overview (where to look)

- UI & routes: `app/` (root pages, auth flows, and `app/dashboard/`)
- Reusable components: `components/` and `components/ui/`
- Background jobs / functions: `inngest/functions/`
- AI code & RAG helpers: `module/ai/` and `lib/pinecone.ts`
- GitHub helpers: `module/github/lib/github.ts`
- Review & repository domain logic: `module/review/`, `module/repository/`
- Database schema & migrations: `prisma/schema.prisma` and `prisma/migrations/`
- Server utilities and integrations: `lib/` (e.g., `lib/db.ts`, `lib/stripe.ts`, `lib/auth.ts`)

## Getting started (local development)

1. Clone the repository and install dependencies:

```bash
git clone <repo-url>
cd AICodeReview
npm install
```

2. Create an environment file `.env` at the project root with required variables. Example list (verify usage in `lib/` and `module/`):

```
DATABASE_URL=postgresql://user:pass@localhost:5432/aicodereview
NEXT_PUBLIC_VERCEL_URL=http://localhost:3000
PINECONE_API_KEY=
PINECONE_ENV=us-west1-gcp
PINECONE_INDEX=aicodereview
INNGEST_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
GITHUB_TOKEN= # or GITHUB_APP_ID + GITHUB_APP_PRIVATE_KEY
OPENAI_API_KEY= # or LLM provider key
NEXTAUTH_SECRET= # if using NextAuth or similar
```

3. Generate Prisma client and run migrations (dev):

```bash
npx prisma generate
npx prisma migrate dev
```

4. Start the dev server:

```bash
npm run dev
# or: pnpm dev | yarn dev
```

Open `http://localhost:3000`.

## Running background workers & handling webhooks

- Background functions live under `inngest/functions/` — use Inngest's local runner or deploy the worker as a serverless function according to Inngest docs.
- For local webhook testing (Stripe / GitHub), use a tunneling tool (e.g., `ngrok`) and configure provider dashboard webhook URLs and secrets to match your `app/api/*` webhook endpoints.

## Development commands (common)

```bash
npm run dev        # start Next.js dev server
npm run build      # build for production
npm run start      # run production server
npx prisma generate
npx prisma migrate dev
npx tsc --noEmit    # typecheck
npm run lint        # run linter (if configured)
```

Check `package.json` for exact script names used in this repo.

## Tests & quality

- Add unit & integration tests as needed. If no test runner is configured, consider adding `vitest` or `jest` for React/unit tests.
- Keep TypeScript strictness and lint rules enabled.

## Deployment

- App: Vercel is recommended for seamless Next.js deployments. Set environment variables in the Vercel project settings.
- Prisma migrations: use `npx prisma migrate deploy` in your deployment pipeline.
- Background jobs: deploy Inngest workers or use Inngest serverless configuration.
- Webhooks: configure production webhook endpoints and verify signatures using secrets stored in environment variables.

## Security & best practices

- Do not commit `.env` or secrets to source control.
- Validate webhook signatures (Stripe/GitHub) in `app/api/*` endpoints.
- Use minimal permissions for GitHub tokens (only the scopes required).

## Troubleshooting

- Prisma client issues: run `npx prisma generate`.
- Pinecone errors: verify `PINECONE_API_KEY`, `PINECONE_INDEX`, and index readiness.
- Webhook testing locally: use `ngrok` and ensure webhook secrets match.

## Extending the project

- Add seed data scripts for dev databases and sample embeddings.
- Add E2E tests for webhook flows and review generation.
- Add observability: error reporting, job retries, and visibility into background tasks.

## Contributing

- Fork, branch, and open pull requests. Follow the existing code style (TypeScript + Tailwind + React patterns).
- Include tests and ensure type/lint checks pass.

## License

Add a `LICENSE` file at the repository root to state your desired license (MIT, Apache-2.0, etc.).

## Acknowledgements

Built with Next.js, Prisma, Pinecone, Inngest, Tailwind, and Stripe. AI pipelines are provider-agnostic; configure an LLM key in your environment.

----

If you'd like, I can also:

- Scan the codebase to extract the exact environment variables used and insert them into this `README.md`.
- Add a small `scripts/` folder with `dev` helpers (ngrok + worker runner) for local testing.

Tell me which of those you'd like and I'll proceed.
