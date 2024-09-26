import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const extractDomain = (url: string): string => {
  try {
    // Crear un objeto URL
    const parsedUrl = new URL(url);

    // Extraer el hostname (dominio completo)
    const hostname = parsedUrl.hostname;

    // Remover el prefijo 'www.' si está presente
    const domain = hostname.startsWith('www.') ? hostname.slice(4) : hostname;

    return domain;
  } catch (error) {
    return url;
  }
};

export const normalizeUrl = (input: string): string => {
  try {
    let domain: string;

    // Detectar si el input ya es una URL completa
    if (input.startsWith('http://') || input.startsWith('https://')) {
      const parsedUrl = new URL(input);
      domain = parsedUrl.hostname;
    } else {
      domain = input;
    }

    // Eliminar el prefijo 'www.' si está presente
    domain = domain.startsWith('www.') ? domain.slice(4) : domain;

    // Construir la URL completa
    const url = `https://${domain}`;

    return url;
  } catch (error) {
    console.error('Error al procesar el input:', error);
    return input;
  }
};
