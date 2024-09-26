'use client';

import { useParams } from 'next/navigation';

import Navbar from '@/components/Layout/Navbar';

import { Profile } from '@/features/profile';

export default function Page() {
  const params = useParams();

  return (
    <>
      <Navbar showBackPage={true} overrideBack="/dashboard" />

      <Profile pubkey={params?.pubkey as string} />
    </>
  );
}
