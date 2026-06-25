-- OXYCARELABS DYNAMIC PRICING SYSTEM SCHEMA

-- 1. TESTS (EXTENDED)
-- Note: Existing tests table might be JSONB based. 
-- We'll create relational pricing tables that link to the test IDs.

CREATE TABLE IF NOT EXISTS test_pricing (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    test_id TEXT NOT NULL, -- FK to tests.id
    lab_id TEXT NOT NULL,  -- FK to labs.id
    city TEXT NOT NULL,
    lab_cost NUMERIC(10, 2) NOT NULL,
    margin_type TEXT CHECK (margin_type IN ('fixed', 'percentage')),
    margin_value NUMERIC(10, 2) NOT NULL,
    selling_price NUMERIC(10, 2), -- Optional override
    min_price NUMERIC(10, 2),
    max_price NUMERIC(10, 2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. PACKAGE PRICING
CREATE TABLE IF NOT EXISTS package_pricing (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    package_id TEXT NOT NULL, -- FK to packages.id
    lab_id TEXT NOT NULL,     -- FK to labs.id
    city TEXT NOT NULL,
    lab_cost NUMERIC(10, 2) NOT NULL,
    margin_type TEXT CHECK (margin_type IN ('fixed', 'percentage')),
    margin_value NUMERIC(10, 2) NOT NULL,
    selling_price NUMERIC(10, 2), -- Optional override
    min_price NUMERIC(10, 2),
    max_price NUMERIC(10, 2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. PRICING RULES
CREATE TABLE IF NOT EXISTS pricing_rules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    rule_type TEXT CHECK (rule_type IN ('time_based', 'demand_based', 'user_type')),
    condition_json JSONB NOT NULL,
    adjustment_type TEXT CHECK (adjustment_type IN ('increase', 'decrease')),
    adjustment_value NUMERIC(10, 2) NOT NULL,
    priority INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. COUPONS
CREATE TABLE IF NOT EXISTS coupons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT CHECK (discount_type IN ('flat', 'percentage')),
    discount_value NUMERIC(10, 2) NOT NULL,
    min_order_value NUMERIC(10, 2) DEFAULT 0,
    expiry TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_test_pricing_lookup ON test_pricing(test_id, city, is_active);
CREATE INDEX IF NOT EXISTS idx_package_pricing_lookup ON package_pricing(package_id, city, is_active);
CREATE INDEX IF NOT EXISTS idx_pricing_rules_priority ON pricing_rules(priority DESC);
