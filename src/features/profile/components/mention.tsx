// Packages
import { useMemo } from 'react';
import Link from 'next/link';
import { useProfile } from '@lawallet/react';

// Generic components
import { Button } from '@/components/UI/button';
import { Skeleton } from '@/components/UI/skeleton';

export function Mention(props: { value: any }) {
  const { value } = props;

  const paramPubkey = useMemo(() => value as string, [value]);

  const { nip05, isLoading } = useProfile({ pubkey: paramPubkey });

  return (
    <Button size="sm" variant="link" className="p-0 h-auto items-center" disabled={isLoading} asChild={!isLoading}>
      {isLoading ? (
        <>
          @<Skeleton className="inline-flex w-12 h-4 bg-card rounded-full" />
        </>
      ) : (
        <Link href={`/p/${paramPubkey}`} tabIndex={-1}>
          @{nip05?.name || nip05?.displayName}
        </Link>
      )}
    </Button>
  );
}
