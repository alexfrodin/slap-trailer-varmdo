import { site } from '../data/site';

export function pageTitle(title: string): string {
  if (title.includes(site.brandName)) return title;
  return `${title} | ${site.brandName}`;
}

export function absoluteUrl(path = '/'): string {
  const normalized = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`;
  return `${site.url}${normalized}`;
}

export function normalizePath(pathname: string): string {
  if (pathname === '/') return '/';
  return pathname.replace(/\/$/, '');
}
