'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import EarningsSkeleton from '@/components/skeletons/EarningsSkeleton';

// Lazy load the main component to improve initial load performance
const EarningsContent = dynamic(() => import('./EarningsContent'), {
  loading: () => <EarningsSkeleton />,
  ssr: false,
});

export default function EarningsPage() {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <Suspense fallback={<EarningsSkeleton />}>
          <EarningsContent />
        </Suspense>
      </div>
    </div>
  );
}
