'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Icons } from '@/components/icons';

export default function AdminStorePage() {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/signin');
    },
  });

  // Redirect to the new products page
  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/admin/products');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Icons.loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return null;
}
