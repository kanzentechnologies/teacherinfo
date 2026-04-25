-- Run this script in your Supabase SQL Editor to create all the necessary tables for the Admin Dashboard CMS.

-- 1. Pages Table
CREATE TABLE IF NOT EXISTS public.pages (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT NOT NULL,
    date TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Posts Table
CREATE TABLE IF NOT EXISTS public.posts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    "categorySlug" TEXT NOT NULL,
    content TEXT,
    status TEXT NOT NULL,
    date TEXT NOT NULL,
    type TEXT NOT NULL,
    "fileUrl" TEXT,
    "fileSize" TEXT,
    "externalUrl" TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Announcements Table
CREATE TABLE IF NOT EXISTS public.announcements (
    id TEXT PRIMARY KEY,
    text TEXT NOT NULL,
    link TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
    type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Contacts Table
CREATE TABLE IF NOT EXISTS public.contacts (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    link TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Important Links Table
CREATE TABLE IF NOT EXISTS public.important_links (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Menu Items Table
CREATE TABLE IF NOT EXISTS public.menu_items (
    id BIGINT PRIMARY KEY,
    title TEXT NOT NULL,
    link TEXT NOT NULL,
    type TEXT NOT NULL,
    parent_id BIGINT,
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Quick Links Table
CREATE TABLE IF NOT EXISTS public.quick_links (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Services Table
CREATE TABLE IF NOT EXISTS public.services (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT,
    url TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable Row Level Security (RLS) temporarily to resolve permission denied errors
ALTER TABLE public.pages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.important_links DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.quick_links DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.services DISABLE ROW LEVEL SECURITY;

-- Explicitly grant usage and permissions to anon and authenticated roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT ALL ON public.pages TO anon, authenticated;
GRANT ALL ON public.posts TO anon, authenticated;
GRANT ALL ON public.categories TO anon, authenticated;
GRANT ALL ON public.announcements TO anon, authenticated;
GRANT ALL ON public.contacts TO anon, authenticated;
GRANT ALL ON public.important_links TO anon, authenticated;
GRANT ALL ON public.menu_items TO anon, authenticated;
GRANT ALL ON public.quick_links TO anon, authenticated;
GRANT ALL ON public.services TO anon, authenticated;
