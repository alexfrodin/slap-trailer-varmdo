export type OpeningHour = {
  days: Array<
    | 'Monday'
    | 'Tuesday'
    | 'Wednesday'
    | 'Thursday'
    | 'Friday'
    | 'Saturday'
    | 'Sunday'
  >;
  opens: string;
  closes: string;
};

export const site = {
  brandName: 'Släp & Trailer Värmdö',
  legalName: 'Stockholms Drevteknik AB',
  orgNumber: '559358-3726',
  url: import.meta.env.PUBLIC_SITE_URL ?? 'https://slapochtrailervarmdo.se',
  locale: 'sv_SE',
  language: 'sv',
  phoneDisplay: '08-292 392',
  phoneE164: '+468292392',
  email: '[EMAIL]',
  address: {
    street: 'Älvsbyvägen 45',
    postalCode: '139 52',
    city: 'Värmdö',
    region: 'Stockholm',
    country: 'SE',
    countryName: 'Sverige',
  },
  geo: {
    lat: '59.3275642',
    lng: '18.5447323',
  },
  mapsUrl:
    'https://www.google.se/maps/place/Stockholms+Drevteknik+AB/@59.3275642,18.5447323,18.85z/data=!4m6!3m5!1s0x46f57fa0b452d885:0xfa8823bced6c0fc9!8m2!3d59.3279307!4d18.5454551!16s%2Fg%2F11s5cz80fb?entry=ttu',
  gbpUrl: undefined as string | undefined,
  openingHoursLabel: 'Mån–fre 07–16 (Ring före besök, vi kan vara ute på jobb)',
  openingHours: [
    {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '07:00',
      closes: '16:00',
    },
  ] as OpeningHour[],
  serviceAreaNote:
    'Vår verkstad finns på Värmdö, men alla är självklart välkomna oavsett varifrån du kommer. Vi hjälper kunder från hela närområdet och kan även utföra vissa service- och reparationsarbeten ute på plats när det passar bättre än att ta släpet till verkstaden.

Hör av dig och berätta vad du behöver hjälp med, så hittar vi en lösning som passar.',
  social: {
    facebook: undefined as string | undefined,
    instagram: undefined as string | undefined,
  },
  defaultOgImage: '/og-default.jpg',
  form: {
    maxPhotos: 3,
    maxPhotoBytes: 1_000_000,
    acceptedMime: ['image/jpeg', 'image/png', 'image/webp'] as const,
  },
  reviews: [] as Array<{ author: string; quote: string }>,
};

export function isPlaceholder(value: string | undefined | null): boolean {
  return !value || value.startsWith('[');
}

export function formattedAddress(): string {
  const { street, postalCode, city } = site.address;
  return `${street}, ${postalCode} ${city}`;
}

export function legalLine(): string {
  return `${site.brandName} är ett varumärke som drivs av ${site.legalName}, org.nr ${site.orgNumber}.`;
}
