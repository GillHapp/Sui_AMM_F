import type { Metadata } from 'next';
import AppLayoutComponent from '@/components/layout/AppLayout';

export const metadata: Metadata = {
  title: 'SUI AMM App',
  description: 'Swap, Pool, and manage your liquidity on the SUI AMM.',
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppLayoutComponent>{children}</AppLayoutComponent>;
}
