-- 20260327_pantry_items.sql
-- Create the pantry_items table
CREATE TABLE IF NOT EXISTS public.pantry_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    category TEXT CHECK (category IN ('GRAINS', 'PROTEIN', 'DAIRY', 'VEGETABLES', 'FRUITS', 'OTHER')) NOT NULL,
    quantity TEXT,
    weight_kg DECIMAL,
    expiry_date DATE NOT NULL,
    status TEXT DEFAULT 'fresh', -- 'fresh', 'soon', 'expired'
    image_url TEXT,
    freshness_percentage INTEGER DEFAULT 100,
    is_cooked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.pantry_items ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Users can only see their own items" ON public.pantry_items
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own items" ON public.pantry_items
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own items" ON public.pantry_items
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own items" ON public.pantry_items
    FOR DELETE USING (auth.uid() = user_id);

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to call the function
CREATE TRIGGER update_pantry_items_updated_at
    BEFORE UPDATE ON public.pantry_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
