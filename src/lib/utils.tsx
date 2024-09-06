import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { nip19 } from 'nostr-tools';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
