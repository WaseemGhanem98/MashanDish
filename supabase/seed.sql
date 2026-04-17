-- ============================================================
-- Catering App — Bootstrap Seed
--
-- Run this AFTER you've signed up your first admin user via the
-- Supabase dashboard (Authentication → Users → Add user) or by
-- pointing the running app at this database and using the login form
-- to register the user (then confirming their email if email
-- confirmation is enabled).
--
-- Edit the two literals below to match your situation, then run:
--
--   Hosted:  paste into the SQL editor on supabase.com
--   Local:   `npx supabase db reset`  (auto-runs this file)
--
-- This file is idempotent: it uses ON CONFLICT and only promotes a
-- profile if it already exists, so re-running won't break anything.
-- ============================================================

-- 1. The organization. Edit name, vendor_email, timezone as needed.
insert into organizations (id, name, vendor_email, timezone, default_cutoff_time)
values (
  '00000000-0000-0000-0000-000000000001',
  'Acme Inc.',
  'vendor@example.com',
  'America/New_York',
  '10:00:00'
)
on conflict (id) do update
  set name = excluded.name,
      vendor_email = excluded.vendor_email,
      timezone = excluded.timezone,
      default_cutoff_time = excluded.default_cutoff_time;

-- 2. Promote a specific email to admin and link them to the org above.
--    The user must already exist in `auth.users` (sign them up first).
update profiles
   set role = 'admin',
       org_id = '00000000-0000-0000-0000-000000000001'
 where email = 'admin@example.com';  -- <-- CHANGE ME

-- 3. (Optional) Link any other existing users to this org as members.
-- update profiles
--    set org_id = '00000000-0000-0000-0000-000000000001'
--  where org_id is null;
