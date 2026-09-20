import { site, formattedAddress, isPlaceholder } from '../data/site';
import type { Service } from '../data/services';
import { services } from '../data/services';
import { absoluteUrl } from './seo';

const businessId = () => `${site.url}/#business`;

export function localBusinessNode() {
  const address = {
    '@type': 'PostalAddress',
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  };

  const node: Record<string, unknown> = {
    '@type': 'AutomotiveBusiness',
    '@id': businessId(),
    name: site.brandName,
    description:
      'Service och reparation av släpvagnar och båtsläp på Värmdö. Hjullager, bromsar, el, svetsning och kontroll inför besiktning.',
    url: site.url,
    telephone: isPlaceholder(site.phoneE164) ? undefined : site.phoneE164,
    email: isPlaceholder(site.email) ? undefined : site.email,
    address: isPlaceholder(site.address.street) ? undefined : address,
    image: [absoluteUrl(site.defaultOgImage)],
    parentOrganization: {
      '@type': 'Organization',
      name: site.legalName,
      taxID: isPlaceholder(site.orgNumber) ? undefined : site.orgNumber,
    },
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Värmdö' },
      { '@type': 'City', name: 'Gustavsberg' },
      { '@type': 'City', name: 'Ingarö' },
      { '@type': 'AdministrativeArea', name: 'Nacka' },
    ],
  };

  if (!isPlaceholder(site.geo.lat) && !isPlaceholder(site.geo.lng)) {
    node.geo = {
      '@type': 'GeoCoordinates',
      latitude: Number(site.geo.lat),
      longitude: Number(site.geo.lng),
    };
  }

  if (!isPlaceholder(site.mapsUrl)) {
    node.hasMap = site.mapsUrl;
  }

  if (site.openingHours.length > 0) {
    node.openingHoursSpecification = site.openingHours.map((entry) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: entry.days,
      opens: entry.opens,
      closes: entry.closes,
    }));
  }

  const sameAs = [site.gbpUrl, site.social.facebook, site.social.instagram].filter(
    (value): value is string => Boolean(value) && !isPlaceholder(value),
  );
  if (sameAs.length > 0) node.sameAs = sameAs;

  return stripUndefined(node);
}

export function websiteNode() {
  return {
    '@type': 'WebSite',
    name: site.brandName,
    url: site.url,
    inLanguage: 'sv-SE',
    publisher: { '@id': businessId() },
  };
}

export function serviceNode(service: Service) {
  return stripUndefined({
    '@type': 'Service',
    '@id': `${absoluteUrl(`/${service.slug}`)}#service`,
    name: service.cardTitle,
    serviceType: service.schemaServiceType,
    description: service.description,
    url: absoluteUrl(`/${service.slug}`),
    provider: { '@id': businessId() },
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Värmdö' },
      { '@type': 'AdministrativeArea', name: 'Nacka' },
    ],
  });
}

export function homeCatalogNode() {
  return {
    '@type': 'OfferCatalog',
    name: 'Tjänster',
    itemListElement: services.map((service) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: service.cardTitle,
        url: absoluteUrl(`/${service.slug}`),
      },
    })),
  };
}

export function breadcrumbNode(items: Array<{ name: string; path: string }>) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

function stripUndefined<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined),
  ) as T;
}

export { formattedAddress };
