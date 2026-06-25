-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard > SQL Editor)
-- This creates the missing tables needed for cities and OTP functionality

-- ============================================================
-- 1. CITIES TABLE (needed for serviceable cities to persist)
-- ============================================================
CREATE TABLE IF NOT EXISTS cities (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE cities ENABLE ROW LEVEL SECURITY;

-- Allow all operations (frontend is admin-gated via auth)
CREATE POLICY "allow_all_cities" ON cities
    FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- 2. OTP TABLE (needed for OTP to persist across requests)
-- ============================================================
CREATE TABLE IF NOT EXISTS otps (
    phone TEXT PRIMARY KEY,
    otp TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE otps ENABLE ROW LEVEL SECURITY;

-- Allow all operations
CREATE POLICY "allow_all_otps" ON otps
    FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- 3. ENSURE ALL OTHER TABLES HAVE RLS POLICIES
-- (run these if delete/update was failing due to RLS)
-- ============================================================

-- Packages
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'packages' AND policyname = 'allow_all_packages'
    ) THEN
        CREATE POLICY "allow_all_packages" ON packages FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- Categories
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'categories' AND policyname = 'allow_all_categories'
    ) THEN
        CREATE POLICY "allow_all_categories" ON categories FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- Labs
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'labs' AND policyname = 'allow_all_labs'
    ) THEN
        CREATE POLICY "allow_all_labs" ON labs FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- Tests
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'tests' AND policyname = 'allow_all_tests'
    ) THEN
        CREATE POLICY "allow_all_tests" ON tests FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- Blogs
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'blogs' AND policyname = 'allow_all_blogs'
    ) THEN
        CREATE POLICY "allow_all_blogs" ON blogs FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- Bookings
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'bookings' AND policyname = 'allow_all_bookings'
    ) THEN
        CREATE POLICY "allow_all_bookings" ON bookings FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- Users
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'allow_all_users'
    ) THEN
        CREATE POLICY "allow_all_users" ON users FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

SELECT 'All tables and policies created successfully!' as status;
