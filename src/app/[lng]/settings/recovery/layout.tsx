import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Respaldar cuenta - LaWallet',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
