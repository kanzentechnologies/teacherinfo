-- Run this script in your Supabase SQL Editor to create all the necessary tables for the Admin Dashboard CMS.
-- This schema is updated to match the application's stores and feature requirements.

-- 1. Nav Items Table (Managed by 'Pages & Menu')
CREATE TABLE IF NOT EXISTS public.nav_items (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    parent_id TEXT REFERENCES public.nav_items(id) ON DELETE SET NULL,
    is_page BOOLEAN NOT NULL DEFAULT true,
    content TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Published',
    "external_url" TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Announcements Table
CREATE TABLE IF NOT EXISTS public.announcements (
    id BIGINT PRIMARY KEY,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'Normal',
    status TEXT NOT NULL DEFAULT 'Active',
    link TEXT,
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Contacts Table
CREATE TABLE IF NOT EXISTS public.contacts (
    id BIGINT PRIMARY KEY,
    name TEXT NOT NULL,
    designation TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    image_url TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Important Links Table (Sidebar Links)
CREATE TABLE IF NOT EXISTS public.important_links (
    id BIGINT PRIMARY KEY,
    title TEXT NOT NULL,
    link TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Quick Links Table (Homepage Icon Links)
CREATE TABLE IF NOT EXISTS public.quick_links (
    id BIGINT PRIMARY KEY,
    title TEXT NOT NULL,
    link TEXT NOT NULL,
    icon TEXT NOT NULL DEFAULT 'Link',
    color TEXT NOT NULL DEFAULT 'blue',
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Services Table (Homepage Official Services)
CREATE TABLE IF NOT EXISTS public.services (
    id BIGINT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    link TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure columns exist (for existing tables)
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS date TEXT;
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS link TEXT;
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'Normal';
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Active';
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS category_slug TEXT;
ALTER TABLE public.nav_items ADD COLUMN IF NOT EXISTS external_url TEXT;

-- Legacy/Post Tables (Optional but kept for compatibility)
CREATE TABLE IF NOT EXISTS public.posts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    "category_slug" TEXT NOT NULL,
    content TEXT,
    status TEXT NOT NULL,
    date TEXT NOT NULL,
    type TEXT NOT NULL,
    "fileUrl" TEXT,
    "fileSize" TEXT,
    "externalUrl" TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable Row Level Security (RLS) for all tables to allow the app to work immediately
-- You can enable and configure these later for fine-grained security.

ALTER TABLE public.nav_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.important_links DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.quick_links DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.services DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts DISABLE ROW LEVEL SECURITY;

-- Explicitly grant usage and permissions to anon and authenticated roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT ALL ON public.nav_items TO anon, authenticated;
GRANT ALL ON public.announcements TO anon, authenticated;
GRANT ALL ON public.contacts TO anon, authenticated;
GRANT ALL ON public.important_links TO anon, authenticated;
GRANT ALL ON public.quick_links TO anon, authenticated;
GRANT ALL ON public.services TO anon, authenticated;
GRANT ALL ON public.posts TO anon, authenticated;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_nav_items_slug ON public.nav_items(slug);
CREATE INDEX IF NOT EXISTS idx_nav_items_parent ON public.nav_items(parent_id);
