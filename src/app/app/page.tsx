'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page will redirect to the swap page by default or can render swap page directly.
// For simplicity, redirecting.
export default function AppPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/app/swap');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-full">
      <p>Loading Application...</p>
      {/* Optionally, include a spinner here */}
    </div>
  );
}
