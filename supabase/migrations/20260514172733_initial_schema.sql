-- Create models table
create table models (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamp with time zone default now()
);

-- Create themes table
create table themes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamp with time zone default now()
);

-- Create attendance table
create table attendance (
  id uuid primary key default gen_random_uuid(),
  model_id uuid references models(id) on delete cascade,
  theme_id uuid references themes(id) on delete cascade,
  day integer not null check (day in (1, 2)),
  shift integer not null check (shift in (1, 2)),
  attended boolean default false,
  created_at timestamp with time zone default now(),
  unique(model_id, theme_id, day, shift)
);

-- Enable RLS
alter table models enable row level security;
alter table themes enable row level security;
alter table attendance enable row level security;

-- Create policies (Public for now, anyone with the key can read/write)
create policy "Public Access Models" on models for all using (true) with check (true);
create policy "Public Access Themes" on themes for all using (true) with check (true);
create policy "Public Access Attendance" on attendance for all using (true) with check (true);
