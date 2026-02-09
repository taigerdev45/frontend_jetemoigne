-- JETEMOIGNE-TV : SCHÉMA DE BASE DE DONNÉES COMPLET (Supabase / PostgreSQL)
-- Date: 2026-02-09

--------------------------------------------------
-- 1. TYPES ÉNUMÉRÉS (ENUMS)
--------------------------------------------------

CREATE TYPE public.user_role AS ENUM ('super_admin', 'admin', 'manager', 'accountant', 'observer');
CREATE TYPE public.program_category AS ENUM ('info', 'jeunesse_cinema', 'divertissement', 'podcast', 'evangelisation', 'concert', 'temoignage_live', 'autre');
CREATE TYPE public.content_format AS ENUM ('video', 'audio', 'ecrit', 'image');
CREATE TYPE public.testimony_status AS ENUM ('recu', 'en_lecture', 'valide', 'rejete', 'programme');
CREATE TYPE public.support_type AS ENUM ('don_financier', 'don_materiel', 'benevolat', 'partenariat', 'achat_ouvrage', 'paiement_pub');
CREATE TYPE public.transaction_status AS ENUM ('en_attente', 'verifie', 'rejete');

--------------------------------------------------
-- 2. TABLES PRINCIPALES
--------------------------------------------------

-- Profils Utilisateurs (Extension de auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role public.user_role DEFAULT 'observer',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Programmes & Direct
CREATE TABLE public.programs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category public.program_category NOT NULL,
  format public.content_format NOT NULL,
  thumbnail_url TEXT,
  video_url TEXT,
  audio_url TEXT,
  content_text TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_live BOOLEAN DEFAULT FALSE,
  views_count BIGINT DEFAULT 0,
  created_by UUID REFERENCES public.profiles(id),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Témoignages
CREATE TABLE public.testimonies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_name TEXT DEFAULT 'Anonyme',
  author_email TEXT,
  title TEXT,
  content_text TEXT,
  media_url TEXT,
  media_type public.content_format NOT NULL,
  status public.testimony_status DEFAULT 'recu',
  admin_notes TEXT,
  reviewed_by UUID REFERENCES public.profiles(id),
  scheduled_for TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projets
CREATE TABLE public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  vision TEXT,
  values TEXT,
  needs TEXT,
  goal_amount DECIMAL(12, 2),
  current_amount DECIMAL(12, 2) DEFAULT 0,
  progress_percent INTEGER DEFAULT 0,
  status TEXT DEFAULT 'en_cours',
  cover_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.project_milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  due_date DATE
);

CREATE TABLE public.project_team (
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id),
  role_in_project TEXT,
  PRIMARY KEY (project_id, user_id)
);

-- Finances & Transactions
CREATE TABLE public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_name TEXT,
  donor_email TEXT,
  donor_phone TEXT,
  amount DECIMAL(12, 2) NOT NULL,
  currency TEXT DEFAULT 'XAF',
  transaction_type public.support_type NOT NULL,
  payment_method TEXT,
  proof_screenshot_url TEXT,
  transaction_ref_id TEXT,
  status public.transaction_status DEFAULT 'en_attente',
  validated_by UUID REFERENCES public.profiles(id),
  project_id UUID REFERENCES public.projects(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RH: Bénévoles & Partenaires
CREATE TABLE public.volunteers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  skills TEXT[],
  availability TEXT,
  status TEXT DEFAULT 'actif',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.partners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  activity_domain TEXT,
  country TEXT,
  logo_url TEXT,
  website_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ressources: Ouvrages & Publicités
CREATE TABLE public.books (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT,
  description TEXT,
  price DECIMAL(10, 2) DEFAULT 0,
  is_free BOOLEAN DEFAULT FALSE,
  pdf_url TEXT NOT NULL,
  cover_url TEXT,
  downloads_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.ads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  media_url TEXT NOT NULL,
  media_type public.content_format,
  redirect_url TEXT,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  clicks_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Configuration
CREATE TABLE public.app_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  airtel_number TEXT,
  moov_number TEXT,
  maintenance_mode BOOLEAN DEFAULT FALSE,
  contact_email TEXT,
  donation_rules TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Analytics
CREATE TABLE public.analytics_daily (
  date DATE PRIMARY KEY DEFAULT CURRENT_DATE,
  total_visits INTEGER DEFAULT 0,
  page_views JSONB,
  device_stats JSONB
);

--------------------------------------------------
-- 3. SÉCURITÉ (RLS & POLICIES)
--------------------------------------------------

-- Activation RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- FONCTIONS HELPERS
CREATE OR REPLACE FUNCTION public.is_staff_member() 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('super_admin', 'admin', 'manager', 'accountant', 'observer')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin_or_super() 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('super_admin', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.has_financial_access() 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('super_admin', 'admin', 'accountant')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- POLICIES: PROFILES
CREATE POLICY "Users: Lire propre profil" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Staff: Lire annuaire" ON public.profiles FOR SELECT USING (public.is_staff_member());
CREATE POLICY "Admin: Gestion utilisateurs" ON public.profiles FOR UPDATE USING (public.is_admin_or_super());

-- POLICIES: PROGRAMS & PROJECTS & BOOKS
CREATE POLICY "Public: Lecture pour tous" ON public.programs FOR SELECT USING (true);
CREATE POLICY "Staff: Gestion complète" ON public.programs FOR ALL USING (public.is_staff_member());

CREATE POLICY "Public: Lecture pour tous" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Staff: Gestion complète" ON public.projects FOR ALL USING (public.is_staff_member());

CREATE POLICY "Public: Lecture pour tous" ON public.books FOR SELECT USING (true);
CREATE POLICY "Staff: Gestion livres" ON public.books FOR ALL USING (public.is_staff_member());

-- POLICIES: ADS
CREATE POLICY "Public: Lecture pubs actives" ON public.ads FOR SELECT USING (is_active = true);
CREATE POLICY "Staff: Gestion pubs" ON public.ads FOR ALL USING (public.is_staff_member());

-- POLICIES: TESTIMONIES
CREATE POLICY "Public: Voir témoignages validés" ON public.testimonies FOR SELECT USING (status IN ('valide', 'programme'));
CREATE POLICY "Public: Déposer un témoignage" ON public.testimonies FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff: Gestion totale témoignages" ON public.testimonies FOR ALL USING (public.is_staff_member());

-- POLICIES: TRANSACTIONS
CREATE POLICY "Public: Faire un don" ON public.transactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Finance: Accès comptable et admin" ON public.transactions FOR ALL USING (public.has_financial_access());

-- POLICIES: APP_SETTINGS
CREATE POLICY "Public: Lire config" ON public.app_settings FOR SELECT USING (true);
CREATE POLICY "Admin: Configurer site" ON public.app_settings FOR UPDATE USING (public.is_admin_or_super());

--------------------------------------------------
-- 4. BUCKETS DE STOCKAGE (SUPABASE STORAGE)
--------------------------------------------------
-- Note: Ces politiques s'appliquent sur storage.objects

-- Bucket: transaction-proofs
-- INSERT: Public
-- SELECT: Staff avec accès financier

-- Insertion des Buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('testimonies-media', 'testimonies-media', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('transaction-proofs', 'transaction-proofs', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('books-files', 'books-files', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('public-assets', 'public-assets', true);

-- POLICIES STORAGE: testimonies-media (Public Read, Public Insert)
CREATE POLICY "Public: Voir medias" ON storage.objects FOR SELECT USING (bucket_id = 'testimonies-media');
CREATE POLICY "Public: Upload medias" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'testimonies-media');

-- POLICIES STORAGE: transaction-proofs (Staff only Select, Public Insert)
CREATE POLICY "Finance: Voir preuves" ON storage.objects FOR SELECT USING (bucket_id = 'transaction-proofs' AND public.has_financial_access());
CREATE POLICY "Public: Upload preuves" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'transaction-proofs');

-- POLICIES STORAGE: books-files (Public Read, Staff Manage)
CREATE POLICY "Public: Lire livres" ON storage.objects FOR SELECT USING (bucket_id = 'books-files');
CREATE POLICY "Staff: Gestion livres" ON storage.objects FOR ALL USING (bucket_id = 'books-files' AND public.is_staff_member());

-- POLICIES STORAGE: public-assets (Public Read, Staff Manage)
CREATE POLICY "Public: Lire assets" ON storage.objects FOR SELECT USING (bucket_id = 'public-assets');
CREATE POLICY "Staff: Gestion assets" ON storage.objects FOR ALL USING (bucket_id = 'public-assets' AND public.is_staff_member());
