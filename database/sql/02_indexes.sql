-- Helpful indexes for time-series queries

create index if not exists idx_co2_intensity_ts on public.co2_intensity ("timestamp");
create index if not exists idx_generation_mix_ts on public.generation_mix ("timestamp");



