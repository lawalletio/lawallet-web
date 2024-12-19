import { StoragedIdentityInfo } from '@/components/AppProvider/AuthProvider';
import { CACHE_BACKUP_KEY, STORAGE_IDENTITY_KEY } from '@/utils/constants';
import { baseConfig, BaseStorage, getMultipleTagsValues, getTag, normalizeLNDomain } from '@lawallet/react';
import { getUsername } from '@lawallet/react/actions';
import { ConfigProps, TransactionDirection } from '@lawallet/react/types';
import { NostrEvent } from 'nostr-tools';

export function checkIOS(navigator: Navigator) {
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    return true;
  } else {
    return Boolean(navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.userAgent));
  }
}

export const extractMetadata = async (
  event: NostrEvent,
  direction: TransactionDirection,
  decrypt: (senderPubkey: string, encryptedMessage: string) => Promise<string>,
  config: ConfigProps = baseConfig,
) => {
  try {
    const receiverPubkey: string = getMultipleTagsValues(event.tags, 'p')[1]!;
    const metadataTag = getTag(event.tags, 'metadata');

    if (metadataTag && metadataTag.length === 4) {
      const [, encrypted, encryptType, message] = metadataTag;

      if (!encrypted) return parseContent(message!);

      if (encryptType === 'nip04') {
        const decryptPubkey: string = direction === TransactionDirection.INCOMING ? event.pubkey : receiverPubkey;

        const decryptedMessage = await decrypt(decryptPubkey, message!);

        if (decryptedMessage.length) {
          const parsedDecryptedMessage = parseContent(decryptedMessage);

          if (
            direction === TransactionDirection.OUTGOING &&
            receiverPubkey !== config.modulePubkeys.urlx &&
            (!parsedDecryptedMessage || !parsedDecryptedMessage.receiver)
          ) {
            const receiverUsername = await getUsername(receiverPubkey, config);

            return receiverUsername.length
              ? { receiver: `${receiverUsername}@${normalizeLNDomain(config.endpoints.lightningDomain)}` }
              : {};
          } else {
            return parsedDecryptedMessage;
          }
        }
      }
    }

    if (direction === TransactionDirection.OUTGOING && receiverPubkey !== config.modulePubkeys.urlx) {
      const receiverUsername = await getUsername(receiverPubkey, config);

      return receiverUsername.length
        ? { receiver: `${receiverUsername}@${normalizeLNDomain(config.endpoints.lightningDomain)}` }
        : {};
    } else {
      if (
        direction === TransactionDirection.INCOMING &&
        event.pubkey !== config.modulePubkeys.urlx &&
        event.pubkey !== config.modulePubkeys.card
      ) {
        const senderUsername = await getUsername(event.pubkey, config);

        return senderUsername.length
          ? { sender: `${senderUsername}@${normalizeLNDomain(config.endpoints.lightningDomain)}` }
          : {};
      } else {
        return {};
      }
    }
  } catch {
    return {};
  }
};

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
