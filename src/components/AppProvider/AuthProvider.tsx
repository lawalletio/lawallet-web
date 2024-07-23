import { usePathname, useRouter } from '@/navigation';
import { STORAGE_IDENTITY_KEY } from '@/utils/constants';
import { parseContent, useConfig, useIdentity, useNostr } from '@lawallet/react';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo } from 'react';
import SpinnerView from '../Spinner/SpinnerView';

interface RouterInfo {
  disconnectedPaths: string[]; // Routes that require you to NOT have a connected account
  connectedPaths: string[]; // Routes that require you to HAVE a connected account
}

const AppRouter: RouterInfo = {
  disconnectedPaths: ['/', '/start', '/signup', '/login', '/reset'],
  connectedPaths: ['/dashboard', '/deposit', '/extensions', '/scan', '/settings', '/transactions', '/transfer'],
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
  const { initializeSigner } = useNostr();

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
      const storageIdentity = await config.storage.getItem(STORAGE_IDENTITY_KEY);

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
        const localStorageKey = localStorage.getItem(STORAGE_IDENTITY_KEY);
        if (!localStorageKey) {
          identity.reset();
          setIsLoading(false);
          return false;
        }

        const parsedIdentity: StoragedIdentityInfo = parseContent(localStorageKey as string);
        const auth: boolean = await authenticate(parsedIdentity.privateKey);

        if (auth) {
          const IdentityToSave: StoragedIdentityInfo[] = [
            {
              username: parsedIdentity?.username ?? '',
              pubkey: parsedIdentity?.pubkey ?? '',
              privateKey: parsedIdentity.privateKey,
            },
          ];

          await config.storage.setItem(STORAGE_IDENTITY_KEY, JSON.stringify(IdentityToSave));
        }
        return auth;
        // ******************************************
        // After removing the patch, leave only this lines:
        // identity.reset();
        // setIsLoading(false);
        // return false;
        // ******************************************
      }
    } catch {
      setIsLoading(false);
      return false;
    }
  };

  useEffect(() => {
    loadIdentityFromStorage();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const pathSegment = `/${String(pathname.split('/')[1] ?? '')}`;
      const requireAuth = isProtectedRoute(pathSegment, AppRouter.connectedPaths);
      const requireDisconnectedUser = isProtectedRoute(pathSegment, AppRouter.disconnectedPaths);

      const userConnected: boolean = Boolean(identity.pubkey.length);

      switch (true) {
        case !userConnected && requireAuth:
          router.push('/');
          break;

        case userConnected && requireDisconnectedUser:
          router.push('/dashboard');
          break;

        default: {
          const card: string = params.get('c') || '';
          if (card) router.push(`/settings/cards?c=${card}`);
          break;
        }
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
