interface ProviderBase {
  enable(): Promise<void>;
  on(...args: Parameters<EventEmitter['on']>): void;
  off(...args: Parameters<EventEmitter['off']>): void;
  emit(...args: Parameters<EventEmitter['emit']>): void;
  isEnabled(): Promise<boolean>;
  execute(action: string, args?: Record<string, unknown>): Promise<Record<string, unknown>>;
}

interface KeysendArgs {
  dest: string;
  amount: number;
  customRecords?: Record<string, unknown>;
}

interface RequestInvoiceArgs {
  amount: string | number;
  memo?: string;
}

interface WebLNProvider extends ProviderBase {
  getInfo(): Promise<Record<string, unknown>>;
  lnurl(lnurlEncoded: string): Promise<Record<string, unknown>>;
  sendPayment(paymentRequest: string): Promise<Record<string, unknown>>;
  sendPaymentAsync(paymentRequest: string): Promise<Record<string, unknown>>;
  keysend(args: KeysendArgs): Promise<Record<string, unknown>>;
  makeInvoice(args: string | number | RequestInvoiceArgs): Promise<Record<string, unknown>>;
  signMessage(message: string): Promise<Record<string, unknown>>;
  verifyMessage(signature: string, message: string): void;
  getBalance(): Promise<Record<string, unknown>>;
  request(method: string, params: Record<string, unknown>): Promise<Record<string, unknown>>;
}

interface Nip04 {
  encrypt(peer: string, plaintext: string): Promise<Record<string, unknown>>;
  decrypt(peer: string, ciphertext: string): Promise<Record<string, unknown>>;
}

interface Nip44 {
  encrypt(peer: string, plaintext: string): Promise<Record<string, unknown>>;
  decrypt(peer: string, ciphertext: string): Promise<Record<string, unknown>>;
}

interface NostrProvider extends ProviderBase {
  nip04: INip04;
  nip44: INip44;
  getPublicKey(): Promise<Record<string, unknown>>;
  signEvent(event: Event): Promise<Record<string, unknown>>;
  signSchnorr(sigHash: string): Promise<Record<string, unknown>>;
  getRelays(): Promise<Record<string, unknown>>;
}

interface AlbyProvider extends ProviderBase {
  webln: WebLNProvider;
  nostr: NostrProvider;
  webbtc: WebBTCProvider;
  liquid: LiquidProvider;

  addAccount(params: {
    name: string;
    connector: string;
    config: Record<string, unknown>;
  }): Promise<Record<string, unknown>>;
}

interface Window {
  webln?: WebLNProvider;
  nostr?: NostrProvider;
  alby?: AlbyProvider;
}
