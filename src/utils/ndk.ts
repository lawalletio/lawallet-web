import NDK, { NDKEvent, NDKSigner, NostrEvent } from '@nostr-dev-kit/ndk';

export const initializeNDK = async (relays: string[], signer: NDKSigner) => {
  const ndkProvider = new NDK({
    explicitRelayUrls: relays,
    signer,
  });

  await ndkProvider.connect();
  return ndkProvider;
};

export const signNdk = async (ndk: NDK, eventInfo: NostrEvent, publish: boolean = false) => {
  const event: NDKEvent = new NDKEvent(ndk, eventInfo);

  await event.sign();
  if (publish) await event.publish();

  return event.toNostrEvent();
};
