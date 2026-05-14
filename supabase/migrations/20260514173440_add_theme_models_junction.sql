-- Create theme_models junction table
create table theme_models (
  id uuid primary key default gen_random_uuid(),
  theme_id uuid references themes(id) on delete cascade,
  model_id uuid references models(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique(theme_id, model_id)
);

-- Enable RLS
alter table theme_models enable row level security;

-- Create policies
create policy "Public Access Theme Models" on theme_models for all using (true) with check (true);

-- Update attendance to potentially only allow assigned models (optional logic, but good for DB integrity)
-- No changes needed to attendance table, but the UI will filter by theme_models.
