-- ==========================================
-- Eco-Scan: HACKATHON QUICK FIX
-- Use this if you hit RLS 42501 errors
-- ==========================================

-- 1. Disable RLS to allow all inserts (Fastest for testing)
ALTER TABLE public.pantry_items DISABLE ROW LEVEL SECURITY;

-- 2. Ensure table is lowercase
-- (If you created it as Pantry_Items, run this)
-- ALTER TABLE "Pantry_Items" RENAME TO pantry_items;

-- 3. Reload schema cache just in case
NOTIFY pgrst, 'reload schema';
