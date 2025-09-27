-- Enable Row Level Security and add permissive anon policies for demo ingestion

alter table public.co2_intensity enable row level security;
alter table public.generation_mix enable row level security;
alter table public.netzero_alignment enable row level security;

-- For demo/dev, allow inserts and reads for anon key. Restrict in production.
drop policy if exists "co2_intensity anon read" on public.co2_intensity;
create policy "co2_intensity anon read" on public.co2_intensity for select using (true);
drop policy if exists "co2_intensity anon insert" on public.co2_intensity;
create policy "co2_intensity anon insert" on public.co2_intensity for insert with check (true);

drop policy if exists "generation_mix anon read" on public.generation_mix;
create policy "generation_mix anon read" on public.generation_mix for select using (true);
drop policy if exists "generation_mix anon insert" on public.generation_mix;
create policy "generation_mix anon insert" on public.generation_mix for insert with check (true);

drop policy if exists "netzero_alignment anon read" on public.netzero_alignment;
create policy "netzero_alignment anon read" on public.netzero_alignment for select using (true);
drop policy if exists "netzero_alignment anon insert" on public.netzero_alignment;
create policy "netzero_alignment anon insert" on public.netzero_alignment for insert with check (true);

