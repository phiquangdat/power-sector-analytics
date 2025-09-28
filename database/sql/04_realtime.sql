-- Enable realtime for tables (optional if using Supabase Realtime for subscriptions)
-- In Supabase dashboard: Database > Replication > Publication 'supabase_realtime'
-- Ensure tables are added to publication:

alter publication supabase_realtime add table public.co2_intensity;
alter publication supabase_realtime add table public.generation_mix;
alter publication supabase_realtime add table public.netzero_alignment;



