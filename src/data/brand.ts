export type BrandColors = {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  success: string;
  warning: string;
  error: string;
};

export type BrandAssets = {
  logo: string;
  logoMark: string;
  favicon: string;
  ogImage?: string;
  loginBackground?: string;
};

export type BrandContact = {
  phone?: string;
  instagram?: string;
  address?: string;
  city?: string;
  country?: string;
  openingHour?: string; // Formato 24h 'HH:mm' (Hora Venezuela)
  closingHour?: string; // Formato 24h 'HH:mm' (Hora Venezuela)
};

export type BrandCurrency = {
  code: string;
  symbol: string;
  locale: string;
};

export type BrandTicket = {
  footer: string;
};

export type BrandDelivery = {
  readyWhatsAppMessage: string;
};

export type BrandConfig = {
  name: string;
  shortName: string;
  tagline: string;
  locale: string;
  domain: string;
  siteUrl: string;
  currency: BrandCurrency;
  assets: BrandAssets;
  colors: BrandColors;
  contact: BrandContact;
  ticket: BrandTicket;
  delivery: BrandDelivery;
};

/**
 * Configuración white-label del cliente.
 * Para revender: cambia este archivo, `src/data/product-categories.ts`,
 * `src/data/order-modifiers.ts` y el .env, sin tocar el diseño del sistema.
 *
 * Assets en public/brand/ (logo.webp, favicon.webp, etc.)
 */
export const brand = {
  name: 'TKEÑOS.SC',
  shortName: 'TK',
  tagline: 'Los mejores TKEÑOS que vas a probar',
  locale: 'es',
  domain: 'xn--tkeos-sc-f3a.com',
  siteUrl: 'https://xn--tkeos-sc-f3a.com',

  currency: {
    code: 'COP',
    symbol: '$',
    locale: 'es-CO',
  },

  assets: {
    logo: '/brand/logo.png',
    logoMark: '/brand/logo.png',
    favicon: '/brand/favicon.png',
    ogImage: '/brand/og-image.png',
    loginBackground: undefined,
  },

  colors: {
    primary: '#eeece4',
    primaryForeground: '#222222',
    secondary: '#f9aa0b',
    secondaryForeground: '#222222',
    accent: '#eeece4',
    background: '#222222',
    surface: '#a3a3a3',
    text: '#eeece4',
    textMuted: '#0d0d0eff',
    border: '#f9aa0b',
    success: '#2D6A4F',
    warning: '#E9C46A',
    error: '#D00000',
  },

  contact: {
    phone: '+58 412-6545300',
    instagram: '@tkenos.sc',
    address: 'Justo detrás de los bomberos, a mitad de cuesta subiendo el obelisco',
    city: 'San Cristóbal',
    country: 'Venezuela',
    openingHour: '8:00',
    closingHour: '20:00',
  },

  ticket: {
    footer: '¡Gracias por su preferencia!',
  },

  delivery: {
    readyWhatsAppMessage:
      'Hola {customer_name}, tu pedido en {brand_name} ya está listo y será enviado en breve. ¡Gracias por tu preferencia!',
  },
} as const satisfies BrandConfig;

export function brandCssVariables(): Record<string, string> {
  return {
    '--color-primary': brand.colors.primary,
    '--color-primary-foreground': brand.colors.primaryForeground,
    '--color-secondary': brand.colors.secondary,
    '--color-secondary-foreground': brand.colors.secondaryForeground,
    '--color-accent': brand.colors.accent,
    '--color-background': brand.colors.background,
    '--color-surface': brand.colors.surface,
    '--color-text': brand.colors.text,
    '--color-text-muted': brand.colors.textMuted,
    '--color-border': brand.colors.border,
    '--color-success': brand.colors.success,
    '--color-warning': brand.colors.warning,
    '--color-error': brand.colors.error,
  };
}

export function brandCssVariablesStyle(): string {
  return `:root { ${Object.entries(brandCssVariables())
    .map(([key, value]) => `${key}: ${value}`)
    .join('; ')}; }`;
}
