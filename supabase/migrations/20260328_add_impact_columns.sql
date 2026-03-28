-- Add missing carbon impact columns to pantry_items
ALTER TABLE public.pantry_items 
ADD COLUMN IF NOT EXISTS carbon_impact_factor DECIMAL DEFAULT 2.5,
ADD COLUMN IF NOT EXISTS co2e_saved DECIMAL DEFAULT 1.25;
