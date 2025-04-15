'use client';

import { usePullToRefresh } from 'use-pull-to-refresh';
import React, { useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useRouter } from '@/navigation';

export default function PullRefreshProvider({ children }: { children: React.ReactNode }) {
  const [version, setVersion] = useState(0);
  const router = useRouter();

  const isiOSStandalone = useMemo(() => {
    if (!window || typeof navigator === 'undefined') return false;

    const isiOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;
    return isiOS && standalone;
  }, []);

  const { isRefreshing, pullPosition } = usePullToRefresh({
    onRefresh: () => {
      router.refresh();
      setVersion((v) => v + 1);
    },
    isDisabled: !isiOSStandalone,
    maximumPullLength: 240,
    refreshThreshold: 180,
  });

  return (
    <>
      {isiOSStandalone && (
        <div
          className={`
    fixed left-1/2 z-[9999] h-8 w-8 -translate-x-1/2
    flex items-center justify-center
    rounded-full bg-background shadow-md
    transition-opacity
    ${isRefreshing || pullPosition > 0 ? 'opacity-100' : 'opacity-0'}
  `}
          style={{
            top: `calc(${pullPosition / 3}px + env(safe-area-inset-top))`,
            transform: `translateX(-50%) rotate(${isRefreshing ? 0 : pullPosition}deg)`,
          }}
        >
          <RefreshCw size={18} strokeWidth={2} className={`refresh-icon ${isRefreshing ? 'animate-spin' : ''}`} />
        </div>
      )}
      <React.Fragment key={version}>{children}</React.Fragment>
    </>
  );
}
