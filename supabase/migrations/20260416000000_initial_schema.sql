-- ============================================================
-- Catering App — Initial Schema
-- ============================================================

-- Organizations
create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  vendor_email text not null,
  timezone text not null default 'America/New_York',
  default_cutoff_time time not null default '10:00:00',
  created_at timestamptz not null default now()
);

-- Profiles (extends auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  role text not null check (role in ('member','admin','vendor')) default 'member',
  org_id uuid references organizations(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Menus (one per org per day)
create table menus (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  date date not null,
  cutoff_at timestamptz not null,
  status text not null check (status in ('draft','published','locked')) default 'draft',
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  unique(org_id, date)
);

-- Menu items
create table menu_items (
  id uuid primary key default gen_random_uuid(),
  menu_id uuid not null references menus(id) on delete cascade,
  name text not null,
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Selections (one per user per menu)
create table selections (
  id uuid primary key default gen_random_uuid(),
  menu_id uuid not null references menus(id) on delete cascade,
  menu_item_id uuid not null references menu_items(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(menu_id, user_id)
);

-- Indexes for common queries
create index idx_menus_org_date on menus(org_id, date desc);
create index idx_selections_menu on selections(menu_id);
create index idx_selections_user on selections(user_id);

-- ============================================================
-- Helper functions
-- ============================================================

create or replace function is_admin_of(_org_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid()
      and org_id = _org_id
      and role = 'admin'
  );
$$;

create or replace function my_org_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select org_id from profiles where id = auth.uid();
$$;

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into profiles (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data->>'name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================
-- Row-Level Security
-- ============================================================

alter table organizations enable row level security;
alter table profiles enable row level security;
alter table menus enable row level security;
alter table menu_items enable row level security;
alter table selections enable row level security;

-- organizations: members can read their own org; only admins can update
create policy "org_select_own" on organizations
  for select using (id = my_org_id());

create policy "org_update_admin" on organizations
  for update using (is_admin_of(id));

-- profiles: users read own + same-org profiles; update own name only
create policy "profile_select_self_or_org" on profiles
  for select using (
    id = auth.uid() or org_id = my_org_id()
  );

create policy "profile_update_self" on profiles
  for update using (id = auth.uid())
  with check (id = auth.uid() and role = (select role from profiles where id = auth.uid()));

-- Admins can update roles/org within their org
create policy "profile_update_admin" on profiles
  for update using (is_admin_of(org_id));

-- menus: readable by org members; writable by admins only
create policy "menu_select_org" on menus
  for select using (org_id = my_org_id());

create policy "menu_insert_admin" on menus
  for insert with check (is_admin_of(org_id));

create policy "menu_update_admin" on menus
  for update using (is_admin_of(org_id) and status != 'locked');

create policy "menu_delete_admin" on menus
  for delete using (is_admin_of(org_id) and status != 'locked');

-- menu_items: readable by org; writable by admins of org only
create policy "menu_items_select_org" on menu_items
  for select using (
    exists (select 1 from menus m where m.id = menu_id and m.org_id = my_org_id())
  );

create policy "menu_items_write_admin" on menu_items
  for all using (
    exists (select 1 from menus m where m.id = menu_id and is_admin_of(m.org_id) and m.status != 'locked')
  )
  with check (
    exists (select 1 from menus m where m.id = menu_id and is_admin_of(m.org_id) and m.status != 'locked')
  );

-- selections: user manages own; admins read org selections; all writes blocked after cutoff
create policy "selection_select_own_or_admin" on selections
  for select using (
    user_id = auth.uid()
    or exists (select 1 from menus m where m.id = menu_id and is_admin_of(m.org_id))
  );

create policy "selection_insert_self_before_cutoff" on selections
  for insert with check (
    user_id = auth.uid()
    and exists (
      select 1 from menus m
      where m.id = menu_id
        and m.org_id = my_org_id()
        and m.status = 'published'
        and now() < m.cutoff_at
    )
  );

create policy "selection_update_self_before_cutoff" on selections
  for update using (
    user_id = auth.uid()
    and exists (
      select 1 from menus m
      where m.id = menu_id
        and m.status = 'published'
        and now() < m.cutoff_at
    )
  );

create policy "selection_delete_self_before_cutoff" on selections
  for delete using (
    user_id = auth.uid()
    and exists (
      select 1 from menus m
      where m.id = menu_id
        and m.status = 'published'
        and now() < m.cutoff_at
    )
  );
