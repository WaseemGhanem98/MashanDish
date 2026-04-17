# Kickoff Prompt for Claude Opus 4.7 in Cursor

Copy the block below as your **first message** to Opus in a new Cursor chat. Make sure `docs/PRD.md`, `.cursor/rules/`, and `supabase/migrations/` are already in the project folder.

---

```
You're helping me build a catering web app. Before doing anything:

1. Read `docs/PRD.md` fully.
2. Read all files in `.cursor/rules/`.
3. Read `supabase/migrations/20260416000000_initial_schema.sql`.

Then, do NOT write code yet. Instead:

A. Summarize the app in 4 sentences to confirm you understand it.
B. Propose a step-by-step build plan for Slice 1 (Foundation: Next.js app + Supabase client + auth + profiles + protected routes). List every file you'll create or modify with a one-line purpose for each.
C. List the exact commands I need to run (npm installs, Supabase CLI setup, env vars).
D. Flag anything in the PRD that's ambiguous or that you'd recommend changing.

After I approve your plan, you'll execute it one file at a time. For each file, show me the diff before applying. If you hit a decision point (e.g., "should this be a Server Action or Route Handler?"), stop and ask.

We're using: Next.js 14+ App Router, TypeScript strict, Tailwind, shadcn/ui, Supabase (@supabase/ssr), Resend. Deploy target is Vercel.

Don't skip ahead. Don't write more than Slice 1 until I say go.
```

---

## Tips for subsequent sessions

- Start every new chat with: *"Read `docs/PRD.md` and the current state of the codebase. We're working on Slice N: [description]. Propose a plan first."*
- When Opus veers off, paste: *"Stop. Re-read the PRD and our rules. Does your last change align?"*
- Commit to git after every working slice — gives you a rollback point if Opus makes a mess
- If a debug session drags on, start a fresh chat and paste just the relevant file + error. Long context gets stale.

## Recommended slice cadence

| Slice | Feature | Est. time |
|-------|---------|-----------|
| 1 | Auth + profiles + protected routes | 1–2 hrs |
| 2 | Admin creates menu | 1–2 hrs |
| 3 | Member sees today's menu | 30–60 min |
| 4 | Member picks a meal | 1 hr |
| 5 | Admin summary view | 1 hr |
| 6 | Cutoff lock + vendor email | 2 hrs |
| 7 | CSV/PDF export | 1 hr |
| 8 | PWA + polish | 1–2 hrs |

Review, commit, and take a break between slices. Don't try to do the whole thing in one marathon.
