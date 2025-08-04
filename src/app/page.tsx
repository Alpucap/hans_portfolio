'use client';

import dynamic from 'next/dynamic';
import Loader from '@/components/loader';

const Homepage = dynamic(() => import("@/app/pages/home"), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <Loader size="lg" color="cyan" />
    </div>
  ),
});

export default function Home() {
  return <Homepage />;
}
