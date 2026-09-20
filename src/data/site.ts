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
  legalName: '[COMPANY_NAME] AB',
  orgNumber: '[ORG_NUMBER]',
  url: import.meta.env.PUBLIC_SITE_URL ?? 'https://slapochtrailervarmdo.se',
  locale: 'sv_SE',
  language: 'sv',
  phoneDisplay: '[PHONE]',
  phoneE164: '[PHONE_E164]',
  email: '[EMAIL]',
  address: {
    street: '[ADDRESS_STREET]',
    postalCode: '[ADDRESS_POSTAL]',
    city: '[ADDRESS_CITY]',
    region: 'Stockholm',
    country: 'SE',
    countryName: 'Sverige',
  },
  geo: {
    lat: '[GEO_LAT]',
    lng: '[GEO_LNG]',
  },
  mapsUrl: '[MAPS_DIRECTIONS_URL]',
  gbpUrl: undefined as string | undefined,
  openingHoursLabel: '[OPENING_HOURS]',
  openingHours: [] as OpeningHour[],
  serviceAreaNote:
    'Verkstaden ligger på Värmdö. Du är välkommen med släpet hit oavsett om du kommer från Gustavsberg, Ingarö, Nacka eller östra Stockholm.',
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
