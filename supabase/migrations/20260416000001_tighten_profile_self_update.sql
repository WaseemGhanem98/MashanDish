-- ============================================================
-- Tighten profile_update_self
--
-- The original policy only forbade `role` changes by self. That left a
-- gap: a member could update their own row to set `org_id` to a different
-- organization, instantly granting themselves read access to that org's
-- menus and selections (every other policy keys off `my_org_id()`).
--
-- This migration replaces the policy so a user updating their own row
-- can ONLY change the `name` column. `role`, `org_id`, `email`, and `id`
-- are pinned to their existing values via the `with check` clause.
--
-- Admins keep full update access via the existing `profile_update_admin`
-- policy, which is unchanged.
-- ============================================================

drop policy if exists "profile_update_self" on profiles;

create policy "profile_update_self" on profiles
  for update
  using (id = auth.uid())
  with check (
    id = auth.uid()
    and role  = (select role  from profiles where id = auth.uid())
    and org_id is not distinct from (select org_id from profiles where id = auth.uid())
    and email = (select email from profiles where id = auth.uid())
  );
