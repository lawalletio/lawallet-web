import { StoragedIdentityInfo } from '@/components/AppProvider/AuthProvider';
import { CACHE_BACKUP_KEY, STORAGE_IDENTITY_KEY } from '@/utils/constants';
import { BaseStorage } from '@lawallet/react';

export function checkIOS(navigator: Navigator) {
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    return true;
  } else {
    return Boolean(navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.userAgent));
  }
}

export function parseContent(content: string) {
  try {
    const parsed = JSON.parse(content);
    return parsed;
  } catch {
    return {};
  }
}

export const formatBigNumber = (number: number | string) => {
  return Number(number).toLocaleString('es-ES');
};

export const extractFirstTwoChars = (str: string): string => {
  try {
    return str.substring(0, 2).toUpperCase();
  } catch {
    return '--';
  }
};

export const getUserStoragedKey = async (storage: BaseStorage, index: number = 0) => {
  const storagedKey = await storage.getItem(STORAGE_IDENTITY_KEY);
  if (!storagedKey) return '';

  const Identity: StoragedIdentityInfo[] = parseContent(storagedKey);
  return Identity[index]?.privateKey ?? '';
};

export const saveIdentityToStorage = async (
  storage: BaseStorage,
  identity: StoragedIdentityInfo,
  makeBackup: boolean = false,
) => {
  const storagedIdentity = await storage.getItem(STORAGE_IDENTITY_KEY);

  if (storagedIdentity) {
    const identityList: StoragedIdentityInfo[] = parseContent(storagedIdentity);
    identityList.push(identity);

    await storage.setItem(STORAGE_IDENTITY_KEY, JSON.stringify(identityList));
    if (makeBackup) await storage.setItem(`${CACHE_BACKUP_KEY}_${identity.pubkey}`, '1');
  } else {
    const identityToSave: StoragedIdentityInfo[] = [identity];
    await storage.setItem(STORAGE_IDENTITY_KEY, JSON.stringify(identityToSave));
    if (makeBackup) await storage.setItem(`${CACHE_BACKUP_KEY}_${identity.pubkey}`, '1');
  }
};
