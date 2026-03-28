-- ==========================================
-- Eco-Scan: Full Supabase Database Setup
-- Run this in the Supabase SQL Editor
-- ==========================================

-- 1. Create the pantry_items table
CREATE TABLE IF NOT EXISTS public.pantry_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    category TEXT CHECK (category IN ('GRAINS', 'PROTEIN', 'DAIRY', 'VEGETABLES', 'FRUITS', 'OTHER')) NOT NULL,
    quantity TEXT,
    weight_kg DECIMAL DEFAULT 0.5,
    expiry_date DATE NOT NULL,
    status TEXT DEFAULT 'fresh', -- 'fresh', 'soon', 'expired'
    image_url TEXT,
    freshness_percentage INTEGER DEFAULT 100,
    is_cooked BOOLEAN DEFAULT FALSE,
    carbon_impact_factor DECIMAL DEFAULT 2.5,
    co2e_saved DECIMAL DEFAULT 1.25,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.pantry_items ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies (Idempotent)
DO $$ 
BEGIN
    -- Select Policy
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can only see their own items') THEN
        CREATE POLICY "Users can only see their own items" ON public.pantry_items
            FOR SELECT USING (auth.uid() = user_id);
    END IF;

    -- Insert Policy
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can only insert their own items') THEN
        CREATE POLICY "Users can only insert their own items" ON public.pantry_items
            FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;

    -- Update Policy
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can only update their own items') THEN
        CREATE POLICY "Users can only update their own items" ON public.pantry_items
            FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
    END IF;

    -- Delete Policy
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can only delete their own items') THEN
        CREATE POLICY "Users can only delete their own items" ON public.pantry_items
            FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$;

-- 4. Setup Updated At Trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_pantry_items_updated_at ON public.pantry_items;
CREATE TRIGGER update_pantry_items_updated_at
    BEFORE UPDATE ON public.pantry_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
