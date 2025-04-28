import { usePathname, useRouter } from '@/navigation';
import { MappedStoragedKeys, parseContent, useConfig, useIdentity, useNostr } from '@lawallet/react';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo } from 'react';
import SpinnerView from '../Spinner/SpinnerView';

interface RouterInfo {
  disconnectedPaths: string[]; // Routes that require you to NOT have a connected account
  connectedPaths: string[]; // Routes that require you to HAVE a connected account
}

const AppRouter: RouterInfo = {
  disconnectedPaths: ['/', '/start', '/signup', '/login', '/reset'],
  connectedPaths: [
    '/dashboard',
    '/deposit',
    '/extensions',
    '/scan',
    '/settings',
    '/transactions',
    '/transfer',
    '/profile',
  ],
};

export type StoragedIdentityInfo = {
  username: string;
  pubkey: string;
  privateKey: string;
};

const isProtectedRoute = (path: string, paths: string[]): boolean => {
  let isProtected: boolean = false;

  paths.forEach((route) => {
    if (route === path.toLowerCase()) isProtected = true;
  });

  return isProtected;
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const identity = useIdentity();
  const { validateRelaysStatus, initializeSigner } = useNostr();

  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const router = useRouter();
  const config = useConfig();
  const pathname = usePathname();
  const params = useSearchParams();

  const authenticate = async (privateKey: string) => {
    const initialized: boolean = await identity.initializeFromPrivateKey(privateKey);
    if (initialized) initializeSigner(identity.signer);
    setIsLoading(false);

    return initialized;
  };

  const loadIdentityFromStorage = async () => {
    try {
      // If you have the identity saved in IndexedDB, we load from here.
      const storageIdentity = await config.storage.getItem(MappedStoragedKeys.Identity);

      if (storageIdentity) {
        const parsedIdentity: StoragedIdentityInfo[] = parseContent(storageIdentity as string);
        const auth: boolean = await authenticate(parsedIdentity[0]?.privateKey);
        return auth;
      } else {
        // ******************************************
        // PATCH: This code is used to facilitate the migration from localStorage to IndexedDB
        // Date: 20/05/2024
        // Remove this code after migrating the identity provider.
        // ******************************************
        const localStorageKey = localStorage.getItem(MappedStoragedKeys.Identity);
        if (!localStorageKey) {
          identity.reset();
          setIsLoading(false);
          return false;
        }

        const parsedIdentity: StoragedIdentityInfo & { hexpub: string } = parseContent(localStorageKey as string);
        const auth: boolean = await authenticate(parsedIdentity.privateKey);

        if (auth) {
          const IdentityToSave: StoragedIdentityInfo[] = [
            {
              username: parsedIdentity.username,
              pubkey: parsedIdentity.hexpub,
              privateKey: parsedIdentity.privateKey,
            },
          ];

          await config.storage.setItem(MappedStoragedKeys.Identity, JSON.stringify(IdentityToSave));

          // Backup account
          const localStorageBackup = localStorage.getItem(`${MappedStoragedKeys.Backup}_${parsedIdentity.hexpub}`);
          if (localStorageBackup)
            await config.storage.setItem(`${MappedStoragedKeys.Backup}_${parsedIdentity.hexpub}`, '1');
        }
        return auth;
        // ******************************************
      }
    } catch {
      setIsLoading(false);
      return false;
    }
  };

  useEffect(() => {
    loadIdentityFromStorage();

    const verifyRelaysConnection = () => {
      if (document.visibilityState === 'visible') {
        validateRelaysStatus();
      }
    };

    document.addEventListener('visibilitychange', verifyRelaysConnection);

    return () => {
      document.removeEventListener('visibilitychange', verifyRelaysConnection);
    };
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const pathSegment = `/${String(pathname.split('/')[1] ?? '')}`;
      const requireAuth = isProtectedRoute(pathSegment, AppRouter.connectedPaths);
      const requireDisconnectedUser = isProtectedRoute(pathSegment, AppRouter.disconnectedPaths);

      const userConnected: boolean = Boolean(identity.pubkey.length);
      const cardParameter: string = params.get('c') || '';

      switch (true) {
        case userConnected && Boolean(cardParameter.length):
          router.push(`/settings/cards?c=${cardParameter}`);
          break;

        case !userConnected && requireAuth:
          router.push('/');
          break;

        case userConnected && requireDisconnectedUser:
          router.push('/dashboard');
          break;
      }
    }
  }, [pathname, isLoading]);

  const hydrateApp = useMemo((): boolean => {
    if (isLoading) return false;

    const pathSegment = `/${String(pathname.split('/')[1] ?? '')}`;
    const requireAuth: boolean = isProtectedRoute(pathSegment, AppRouter.connectedPaths);
    const requireDisconnectedUser: boolean = isProtectedRoute(pathSegment, AppRouter.disconnectedPaths);

    const userConnected: boolean = Boolean(identity.pubkey.length);

    if (userConnected && requireAuth) return true;
    if (!userConnected && requireDisconnectedUser) return true;

    return Boolean(!requireAuth && !requireDisconnectedUser);
  }, [isLoading, pathname, identity]);

  return !hydrateApp ? <SpinnerView /> : children;
};

export default AuthProvider;
