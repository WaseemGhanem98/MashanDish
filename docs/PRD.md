# Catering App — Product Requirements Document

## Overview
A mobile-first web app for an organization to coordinate daily meal orders with a single vendor. Members log in, view the day's menu (set by an admin), and pick one meal. At a cutoff time, the menu locks and the vendor receives the consolidated order.

**No app store** — deployed as a web app on Vercel. Members "Add to Home Screen" for an app-like feel.

## Users & Roles

| Role | Permissions |
|------|-------------|
| `member` | View today's menu, submit/change own selection before cutoff, view own history |
| `admin` | Everything a member can do + create/edit daily menus, set cutoff time, view all selections, export orders, manage members |
| `vendor` | (Optional — v1 just emails them) View the day's consolidated order |

## Core User Flows

### 1. Member — daily meal pick
1. Opens app on phone → auto-login if session valid, else email/password login
2. Landing screen shows today's menu with meal items (name, description, optional image)
3. Taps one item → confirmation appears → submitted
4. Can change selection until cutoff time
5. After cutoff: selection is locked, shown as read-only

### 2. Admin — create daily menu
1. Navigates to Admin → "New Menu"
2. Picks date, adds 2–6 meal items (name, description)
3. Sets cutoff time (e.g., 10:00 AM)
4. Publishes — members immediately see it
5. Can edit items until first selection is made; after that, only cutoff is editable

### 3. Admin — review & send order
1. At or after cutoff, admin sees summary: item → count, list of names per item
2. Auto-email has been sent to vendor at cutoff
3. Admin can manually resend, export CSV, or download PDF

### 4. Cutoff & vendor notification
- At cutoff time, a scheduled job (Supabase Edge Function or Vercel Cron) locks the menu and sends the vendor email via Resend
- Email format: date, item → count, optional per-person breakdown

## Screens (v1)

**Member-facing:**
- `/login`
- `/` — today's menu + selection
- `/history` — my past selections

**Admin-facing:**
- `/admin` — list of menus (past + upcoming)
- `/admin/menus/new` — create menu
- `/admin/menus/[id]` — edit menu, view selections, export
- `/admin/members` — invite/list/deactivate members

## Data Model

```sql
-- Profiles table extends Supabase auth.users
profiles (
  id uuid PK (references auth.users),
  email text,
  name text,
  role text check (role in ('member','admin','vendor')) default 'member',
  org_id uuid,
  created_at timestamptz
)

organizations (
  id uuid PK,
  name text,
  vendor_email text,
  timezone text default 'America/New_York',
  default_cutoff_time time default '10:00:00'
)

menus (
  id uuid PK,
  org_id uuid FK,
  date date,
  cutoff_at timestamptz,
  status text check (status in ('draft','published','locked')) default 'draft',
  created_by uuid FK -> profiles,
  created_at timestamptz,
  unique(org_id, date)
)

menu_items (
  id uuid PK,
  menu_id uuid FK -> menus,
  name text,
  description text,
  sort_order int default 0
)

selections (
  id uuid PK,
  menu_id uuid FK -> menus,
  menu_item_id uuid FK -> menu_items,
  user_id uuid FK -> profiles,
  created_at timestamptz,
  updated_at timestamptz,
  unique(menu_id, user_id)  -- one pick per member per day
)
```

## Security (Row-Level Security)

Every table has RLS enabled. Key policies:

- `profiles`: user can read own + admins in same org can read all; user can update own name only; role changes only by admin
- `menus`: readable by all members of the org; writable only by admins of that org
- `menu_items`: readable by all members of the org; writable only by admins; blocked entirely if menu is `locked`
- `selections`: user can read/write own; admins can read all in their org; all writes blocked if `now() > menus.cutoff_at`

## Cutoff Logic
- Stored as full timestamp (`cutoff_at`), computed from menu date + org default or admin override
- Enforced in RLS policy for selections (DB-level guarantee)
- Scheduled job runs every minute (or uses cron) to flip menu status to `locked` and trigger vendor email
- UI shows countdown; after cutoff, selection buttons disabled

## Vendor Email Format

**Subject:** Catering order for {date} — {org name}

**Body:**
```
Hi {vendor name},

Here is today's order for {date}:

• {Item A} — 12
• {Item B} — 8
• {Item C} — 3

Total: 23

Per-person list:
{Item A}: Alice, Bob, Carol, …
{Item B}: …

— Sent automatically from {org} Catering App
```

Sent via Resend API at cutoff. Admin can trigger manual resend.

## Non-Functional

- **Mobile-first.** Design for 375px width up. Test on iOS Safari and Chrome Android.
- **PWA.** Manifest + service worker so "Add to Home Screen" gives an app-like launcher.
- **Performance.** Initial load < 2s on 4G. Server Components by default; client components only where needed.
- **Accessibility.** All interactive elements reachable by keyboard, proper ARIA, color contrast AA.
- **Timezone correctness.** All times shown in org timezone; never assume browser = org TZ.

## Out of Scope (v1)
- Payments / per-meal billing
- Dietary filters / allergy tracking
- Multiple vendors
- Vendor-facing login
- Meal ratings / feedback
- Push notifications (nice-to-have v2)

## Tech Stack

- **Framework:** Next.js 14+ (App Router), TypeScript, React Server Components
- **Styling:** Tailwind CSS + shadcn/ui components
- **Auth + DB:** Supabase (email/password auth, Postgres, RLS)
- **Email:** Resend
- **Scheduled jobs:** Vercel Cron (or Supabase Edge Functions)
- **Hosting:** Vercel
- **Analytics (optional):** Vercel Analytics

## Build Order (vertical slices)

1. **Foundation:** Next.js app + Supabase client + `profiles` table + auth (login/logout, protected routes)
2. **Admin can create a menu** (date + items + cutoff, saved to DB)
3. **Member sees today's menu** (read-only list)
4. **Member can pick a meal** (enforces one-per-day via unique constraint)
5. **Admin sees live selection summary**
6. **Cutoff logic** — RLS enforces it, UI reflects locked state
7. **Vendor email on cutoff** (Resend + Vercel Cron)
8. **CSV + PDF export** from admin page
9. **PWA manifest** + install prompt
10. **Polish:** error states, loading skeletons, empty states, mobile gestures

## Success Criteria (v1)

- Admin can create a menu in under 60 seconds
- Member can pick a meal in under 10 seconds from opening the app
- Vendor receives accurate order email within 1 minute of cutoff
- Zero cross-org data leakage (verified by RLS tests)
