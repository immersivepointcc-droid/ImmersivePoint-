-- ============================================================
-- ImmersivePoint — Supabase Database Schema
-- Career Discovery & CRM Platform for Eastern Kentucky
--
-- Apply via Supabase SQL Editor or migrations.
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ------------------------------------------------------------
-- 1. Profiles (extends Supabase auth.users)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  full_name   TEXT,
  role        TEXT NOT NULL DEFAULT 'user'
                CHECK (role IN ('user', 'facilitator', 'partner', 'admin')),
  org_id      UUID,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-create profile on user sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ------------------------------------------------------------
-- 2. Organizations
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.organizations (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  type        TEXT,               -- e.g. 'school', 'nonprofit', 'employer', 'government'
  county      TEXT,               -- Eastern KY county
  address     TEXT,
  phone       TEXT,
  website     TEXT,
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add FK from profiles to organizations
ALTER TABLE public.profiles
  ADD CONSTRAINT fk_profiles_org
  FOREIGN KEY (org_id) REFERENCES public.organizations(id)
  ON DELETE SET NULL;


-- ------------------------------------------------------------
-- 3. Spark Sessions (career discovery sessions)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.spark_sessions (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title         TEXT,
  interests     JSONB DEFAULT '[]',       -- array of interest strings
  strengths     JSONB DEFAULT '[]',       -- array of strength strings
  career_paths  JSONB DEFAULT '[]',       -- AI-suggested career paths
  reflections   TEXT,
  status        TEXT NOT NULL DEFAULT 'in_progress'
                  CHECK (status IN ('in_progress', 'completed', 'archived')),
  completed_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ------------------------------------------------------------
-- 4. Passports (career passports with shareable links)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.passports (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  share_code    TEXT UNIQUE NOT NULL,     -- 8-char code for public sharing
  full_name     TEXT,
  headline      TEXT,
  summary       TEXT,
  skills        JSONB DEFAULT '[]',
  experiences   JSONB DEFAULT '[]',
  education     JSONB DEFAULT '[]',
  certifications JSONB DEFAULT '[]',
  spark_session_ids JSONB DEFAULT '[]',   -- links to Spark sessions
  theme         TEXT DEFAULT 'default',
  is_public     BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_passports_share_code ON public.passports(share_code);
CREATE INDEX IF NOT EXISTS idx_passports_user_id ON public.passports(user_id);


-- ------------------------------------------------------------
-- 5. CRM Contacts
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contacts (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id        UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  first_name    TEXT NOT NULL,
  last_name     TEXT,
  email         TEXT,
  phone         TEXT,
  title         TEXT,                     -- job title
  type          TEXT DEFAULT 'contact'
                  CHECK (type IN ('contact', 'lead', 'partner', 'participant')),
  status        TEXT DEFAULT 'active'
                  CHECK (status IN ('active', 'pending', 'inactive')),
  tags          JSONB DEFAULT '[]',
  notes         TEXT,
  created_by    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contacts_org_id ON public.contacts(org_id);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON public.contacts(status);


-- ------------------------------------------------------------
-- 6. Interactions (CRM activity log)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.interactions (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id    UUID NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
  type          TEXT NOT NULL DEFAULT 'note'
                  CHECK (type IN ('note', 'email', 'call', 'meeting', 'event', 'referral')),
  subject       TEXT,
  body          TEXT,
  occurred_at   TIMESTAMPTZ DEFAULT now(),
  created_by    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_interactions_contact_id ON public.interactions(contact_id);


-- ------------------------------------------------------------
-- 7. Vendor Integrations
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.vendors (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  slug          TEXT UNIQUE NOT NULL,
  description   TEXT,
  category      TEXT,                     -- e.g. 'ai', 'lms', 'communication', 'assessment'
  config        JSONB DEFAULT '{}',       -- integration-specific config (encrypted at rest)
  active        BOOLEAN DEFAULT false,
  api_endpoint  TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vendors_slug ON public.vendors(slug);


-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

ALTER TABLE public.profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spark_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.passports      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors        ENABLE ROW LEVEL SECURITY;


-- ---- Profiles ----

-- Users can read/update their own profile
CREATE POLICY profiles_select_own ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY profiles_update_own ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admins and facilitators can read all profiles in their org
CREATE POLICY profiles_select_org ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles AS p
      WHERE p.id = auth.uid()
        AND p.role IN ('admin', 'facilitator')
        AND p.org_id = profiles.org_id
    )
  );

-- Admins can manage all profiles
CREATE POLICY profiles_admin_all ON public.profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );


-- ---- Organizations ----

-- Anyone authenticated can read organizations
CREATE POLICY orgs_select_authenticated ON public.organizations
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Admins can manage organizations
CREATE POLICY orgs_admin_manage ON public.organizations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );


-- ---- Spark Sessions ----

-- Users own their spark sessions
CREATE POLICY spark_select_own ON public.spark_sessions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY spark_insert_own ON public.spark_sessions
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY spark_update_own ON public.spark_sessions
  FOR UPDATE USING (user_id = auth.uid());

-- Facilitators can read all spark sessions in their org
CREATE POLICY spark_select_facilitator ON public.spark_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles AS p
      WHERE p.id = auth.uid()
        AND p.role IN ('admin', 'facilitator')
    )
  );


-- ---- Passports ----

-- Users own their passports
CREATE POLICY passports_select_own ON public.passports
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY passports_insert_own ON public.passports
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY passports_update_own ON public.passports
  FOR UPDATE USING (user_id = auth.uid());

-- Public passports are readable by anyone (no auth needed)
CREATE POLICY passports_select_public ON public.passports
  FOR SELECT USING (is_public = true);


-- ---- Contacts ----

-- Authenticated users can read contacts
CREATE POLICY contacts_select_authenticated ON public.contacts
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Facilitators, partners, and admins can manage contacts
CREATE POLICY contacts_manage ON public.contacts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('admin', 'facilitator', 'partner')
    )
  );


-- ---- Interactions ----

-- Same access as contacts
CREATE POLICY interactions_select_authenticated ON public.interactions
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY interactions_manage ON public.interactions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('admin', 'facilitator', 'partner')
    )
  );


-- ---- Vendors ----

-- Authenticated users can read vendors
CREATE POLICY vendors_select_authenticated ON public.vendors
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Only admins can manage vendors
CREATE POLICY vendors_admin_manage ON public.vendors
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );


-- ============================================================
-- Indexes for common query patterns
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_spark_sessions_user_id ON public.spark_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_org_id ON public.profiles(org_id);
CREATE INDEX IF NOT EXISTS idx_contacts_created_by ON public.contacts(created_by);
