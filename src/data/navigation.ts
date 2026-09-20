import { services } from './services';

export const serviceLinks = services.map((service) => ({
  href: `/${service.slug}`,
  label: service.navLabel,
}));

export const headerLinks = [
  { href: '/batslap-service', label: 'Båtsläp' },
  { href: '/infor-besiktning', label: 'Inför besiktning' },
  { href: '/kontakt', label: 'Kontakt' },
];

export const footerExtraLinks = [
  { href: '/kontakt', label: 'Kontakt' },
  { href: '/integritetspolicy', label: 'Integritetspolicy' },
];
