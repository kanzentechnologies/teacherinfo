'use client';
import React, { useEffect, useState } from 'react';
import { AdminNav } from './AdminNav';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export function AdminWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // Not logged in
        router.push('/admin');
      } else {
        if (mounted) setLoading(false);
      }
    };
    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          router.push('/admin');
        }
      }
    );

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  if (loading) {
    return <div className="p-8 text-center text-gray-500 font-bold">Verifying Admin Access...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto w-full">
      <AdminNav />
      <div className="flex-1 overflow-x-auto">
        {children}
      </div>
    </div>
  );
}
