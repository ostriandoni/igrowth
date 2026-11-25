-- iGrowth Initial Schema & Row Level Security (RLS)
-- Jalankan migrasi ini di Supabase Dashboard -> SQL Editor (atau via Supabase CLI).
-- Migrasi ini bersifat non-destruktif (menggunakan IF NOT EXISTS).

-- 1. Tabel Profil Pengasuh (Caregivers)
create table if not exists public.caregivers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('Ayah', 'Ibu', 'Nenek', 'Kakek', 'Pengasuh', 'Lainnya')),
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint caregivers_user_id_unique unique (user_id)
);

-- 2. Tabel Profil Anak (Children)
create table if not exists public.children (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  nickname text not null,
  birth_date date not null,
  gender text not null check (gender in ('male', 'female')),
  birth_weight numeric not null,
  birth_height numeric not null,
  birth_head_circumference numeric not null,
  blood_type text,
  avatar_icon text default '👶',
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Tabel Catatan Pertumbuhan (Growth Records)
create table if not exists public.growth_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  child_id uuid not null references public.children(id) on delete cascade,
  date date not null,
  age_months integer not null,
  age_days integer not null,
  weight numeric not null,
  height numeric not null,
  head_circumference numeric not null,
  measure_position text not null check (measure_position in ('recumbent', 'standing')),
  notes text,
  created_at timestamptz not null default now()
);

-- 4. Tabel Progres Milestone Perkembangan
create table if not exists public.milestone_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  child_id uuid not null references public.children(id) on delete cascade,
  milestone_id text not null,
  status text not null check (status in ('not_yet', 'learning', 'achieved')),
  achieved_date date,
  notes text,
  updated_at timestamptz not null default now(),
  constraint milestone_progress_child_milestone_unique unique (child_id, milestone_id)
);

-- 5. Tabel Catatan Makan MPASI (Meal Records)
create table if not exists public.meal_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  child_id uuid not null references public.children(id) on delete cascade,
  date date not null,
  time text not null,
  meal_time text not null check (meal_time in ('sarapan', 'snack_pagi', 'makan_siang', 'snack_sore', 'makan_malam')),
  menu_name text not null,
  amount_eaten text not null check (amount_eaten in ('habis', 'tiga_perempat', 'setengah', 'sedikit', 'gtm')),
  carbs text,
  protein text,
  vegetables text,
  fat text,
  notes text,
  created_at timestamptz not null default now()
);

-- 6. Tabel Uji Alergi Makanan (3-Day Rule)
create table if not exists public.food_allergy_tests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  child_id uuid not null references public.children(id) on delete cascade,
  food_name text not null,
  introduced_date date not null,
  day_count integer not null default 1,
  status text not null check (status in ('safe', 'monitoring', 'allergic')),
  reaction_description text,
  created_at timestamptz not null default now()
);

-- 7. Tabel Log Aktivitas Harian (Susu, Tidur, Popok, Vaksin, Momen)
create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  child_id uuid not null references public.children(id) on delete cascade,
  date date not null,
  time text not null,
  type text not null check (type in ('milk', 'sleep', 'diaper', 'vaccine', 'moment')),
  title text not null,
  details jsonb not null default '{}'::jsonb,
  notes text,
  created_at timestamptz not null default now()
);

-- 8. Tabel Status Jadwal Vaksinasi per Anak
create table if not exists public.vaccine_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  child_id uuid not null references public.children(id) on delete cascade,
  vaccine_id text not null,
  completed boolean not null default false,
  completed_date date,
  updated_at timestamptz not null default now(),
  constraint vaccine_records_child_vaccine_unique unique (child_id, vaccine_id)
);

-- Indexes untuk performa query per user dan per anak
create index if not exists idx_children_user_id on public.children(user_id);
create index if not exists idx_growth_records_child_id on public.growth_records(child_id);
create index if not exists idx_growth_records_user_id on public.growth_records(user_id);
create index if not exists idx_milestone_progress_child_id on public.milestone_progress(child_id);
create index if not exists idx_meal_records_child_id on public.meal_records(child_id);
create index if not exists idx_food_allergy_tests_child_id on public.food_allergy_tests(child_id);
create index if not exists idx_activity_logs_child_id on public.activity_logs(child_id);
create index if not exists idx_vaccine_records_child_id on public.vaccine_records(child_id);

-- Aktifkan Row Level Security (RLS) di semua tabel
alter table public.caregivers enable row level security;
alter table public.children enable row level security;
alter table public.growth_records enable row level security;
alter table public.milestone_progress enable row level security;
alter table public.meal_records enable row level security;
alter table public.food_allergy_tests enable row level security;
alter table public.activity_logs enable row level security;
alter table public.vaccine_records enable row level security;

-- Kebijakan RLS untuk Caregivers
create policy "caregivers_select_own" on public.caregivers
  for select using (auth.uid() = user_id);
create policy "caregivers_insert_own" on public.caregivers
  for insert with check (auth.uid() = user_id);
create policy "caregivers_update_own" on public.caregivers
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "caregivers_delete_own" on public.caregivers
  for delete using (auth.uid() = user_id);

-- Kebijakan RLS untuk Children
create policy "children_select_own" on public.children
  for select using (auth.uid() = user_id);
create policy "children_insert_own" on public.children
  for insert with check (auth.uid() = user_id);
create policy "children_update_own" on public.children
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "children_delete_own" on public.children
  for delete using (auth.uid() = user_id);

-- Kebijakan RLS untuk Growth Records (memastikan user memiliki akses ke child_id terkait)
create policy "growth_records_select_own" on public.growth_records
  for select using (auth.uid() = user_id);
create policy "growth_records_insert_own" on public.growth_records
  for insert with check (
    auth.uid() = user_id
    and exists (select 1 from public.children c where c.id = child_id and c.user_id = auth.uid())
  );
create policy "growth_records_update_own" on public.growth_records
  for update using (auth.uid() = user_id) with check (
    auth.uid() = user_id
    and exists (select 1 from public.children c where c.id = child_id and c.user_id = auth.uid())
  );
create policy "growth_records_delete_own" on public.growth_records
  for delete using (auth.uid() = user_id);

-- Kebijakan RLS untuk Milestone Progress
create policy "milestone_progress_select_own" on public.milestone_progress
  for select using (auth.uid() = user_id);
create policy "milestone_progress_insert_own" on public.milestone_progress
  for insert with check (
    auth.uid() = user_id
    and exists (select 1 from public.children c where c.id = child_id and c.user_id = auth.uid())
  );
create policy "milestone_progress_update_own" on public.milestone_progress
  for update using (auth.uid() = user_id) with check (
    auth.uid() = user_id
    and exists (select 1 from public.children c where c.id = child_id and c.user_id = auth.uid())
  );
create policy "milestone_progress_delete_own" on public.milestone_progress
  for delete using (auth.uid() = user_id);

-- Kebijakan RLS untuk Meal Records
create policy "meal_records_select_own" on public.meal_records
  for select using (auth.uid() = user_id);
create policy "meal_records_insert_own" on public.meal_records
  for insert with check (
    auth.uid() = user_id
    and exists (select 1 from public.children c where c.id = child_id and c.user_id = auth.uid())
  );
create policy "meal_records_update_own" on public.meal_records
  for update using (auth.uid() = user_id) with check (
    auth.uid() = user_id
    and exists (select 1 from public.children c where c.id = child_id and c.user_id = auth.uid())
  );
create policy "meal_records_delete_own" on public.meal_records
  for delete using (auth.uid() = user_id);

-- Kebijakan RLS untuk Food Allergy Tests
create policy "food_allergy_tests_select_own" on public.food_allergy_tests
  for select using (auth.uid() = user_id);
create policy "food_allergy_tests_insert_own" on public.food_allergy_tests
  for insert with check (
    auth.uid() = user_id
    and exists (select 1 from public.children c where c.id = child_id and c.user_id = auth.uid())
  );
create policy "food_allergy_tests_update_own" on public.food_allergy_tests
  for update using (auth.uid() = user_id) with check (
    auth.uid() = user_id
    and exists (select 1 from public.children c where c.id = child_id and c.user_id = auth.uid())
  );
create policy "food_allergy_tests_delete_own" on public.food_allergy_tests
  for delete using (auth.uid() = user_id);

-- Kebijakan RLS untuk Activity Logs
create policy "activity_logs_select_own" on public.activity_logs
  for select using (auth.uid() = user_id);
create policy "activity_logs_insert_own" on public.activity_logs
  for insert with check (
    auth.uid() = user_id
    and exists (select 1 from public.children c where c.id = child_id and c.user_id = auth.uid())
  );
create policy "activity_logs_update_own" on public.activity_logs
  for update using (auth.uid() = user_id) with check (
    auth.uid() = user_id
    and exists (select 1 from public.children c where c.id = child_id and c.user_id = auth.uid())
  );
create policy "activity_logs_delete_own" on public.activity_logs
  for delete using (auth.uid() = user_id);

-- Kebijakan RLS untuk Vaccine Records
create policy "vaccine_records_select_own" on public.vaccine_records
  for select using (auth.uid() = user_id);
create policy "vaccine_records_insert_own" on public.vaccine_records
  for insert with check (
    auth.uid() = user_id
    and exists (select 1 from public.children c where c.id = child_id and c.user_id = auth.uid())
  );
create policy "vaccine_records_update_own" on public.vaccine_records
  for update using (auth.uid() = user_id) with check (
    auth.uid() = user_id
    and exists (select 1 from public.children c where c.id = child_id and c.user_id = auth.uid())
  );
create policy "vaccine_records_delete_own" on public.vaccine_records
  for delete using (auth.uid() = user_id);
