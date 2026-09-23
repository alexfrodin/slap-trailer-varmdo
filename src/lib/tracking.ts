export const ATTRIBUTION_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'gbraid',
  'wbraid',
] as const;

export type AttributionKey = (typeof ATTRIBUTION_KEYS)[number];
export type Attribution = Partial<Record<AttributionKey, string>>;

export const PHONE_LOCATIONS = ['hero', 'header', 'footer', 'contact', 'sticky'] as const;
export type PhoneLocation = (typeof PHONE_LOCATIONS)[number] | 'other';

export const LEAD_EVENT = 'service_request_submitted';
export const PHONE_EVENT = 'phone_click';
export const GA4_LEAD_EVENT = 'generate_lead';

const ATTRIBUTION_LABELS: Record<AttributionKey, string> = {
  utm_source: 'Källa (utm_source)',
  utm_medium: 'Medium (utm_medium)',
  utm_campaign: 'Kampanj (utm_campaign)',
  utm_term: 'Sökord (utm_term)',
  utm_content: 'Annonsinnehåll (utm_content)',
  gclid: 'Google-klick-id (gclid)',
  gbraid: 'Google-klick-id (gbraid)',
  wbraid: 'Google-klick-id (wbraid)',
};

const SAFE_ATTRIBUTION = /^[\p{L}\p{N} ._+\-|:~/]+$/u;
const BLOCKED_PARAM = /email|e-post|phone|telefon|name|namn|message|meddelande|reg|address|file|filename/i;

export type ConsentChoice = 'granted' | 'denied';

export type ConsentState = {
  ads: ConsentChoice | null;
  analytics: ConsentChoice | null;
};

export type LeadFlags = {
  pending: string | null;
  ready: string | null;
  sent: string | null;
};

export function conversionSendTo(id: string, label: string): string | null {
  const cleanId = id.trim();
  const cleanLabel = label.trim();
  if (!cleanId || !cleanLabel) return null;
  return `${cleanId}/${cleanLabel}`;
}

export function consentUpdatePayload(
  choice: { ads: ConsentChoice; analytics: ConsentChoice },
  ga4Enabled: boolean,
) {
  return {
    ad_storage: choice.ads,
    ad_user_data: choice.ads,
    ad_personalization: choice.ads,
    analytics_storage: ga4Enabled && choice.analytics === 'granted' ? 'granted' : 'denied',
  } as const;
}

export function parseStoredConsent(raw: string | null): ConsentState {
  if (raw === '1' || raw === 'granted') return { ads: 'granted', analytics: null };
  if (raw === '0' || raw === 'denied') return { ads: 'denied', analytics: 'denied' };
  if (!raw) return { ads: null, analytics: null };
  try {
    const data = JSON.parse(raw) as { ads?: unknown; analytics?: unknown };
    return {
      ads: asChoice(data.ads),
      analytics: asChoice(data.analytics),
    };
  } catch {
    return { ads: null, analytics: null };
  }
}

export function serializeConsent(state: { ads: ConsentChoice; analytics: ConsentChoice }): string {
  return JSON.stringify({ ads: state.ads, analytics: state.analytics });
}

export function hasConsentChoice(state: ConsentState): boolean {
  return state.ads === 'granted' || state.ads === 'denied';
}

function asChoice(value: unknown): ConsentChoice | null {
  return value === 'granted' || value === 'denied' ? value : null;
}

export function phoneClickParams(location: string | null | undefined): { location: PhoneLocation } {
  if (location && (PHONE_LOCATIONS as readonly string[]).includes(location)) {
    return { location: location as (typeof PHONE_LOCATIONS)[number] };
  }
  return { location: 'other' };
}

export function safeEventParams(params: Record<string, string>): Record<string, string> {
  const safe: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (BLOCKED_PARAM.test(key)) continue;
    safe[key] = value;
  }
  return safe;
}

function cleanAttributionValue(value: unknown): string | undefined {
  const clean = String(value ?? '')
    .replace(/[\u0000-\u001F]/g, '')
    .trim()
    .slice(0, 120);
  if (!clean) return undefined;
  if (clean.includes('@')) return undefined;
  if (/^\+?\d[\d\s()-]{5,}$/.test(clean)) return undefined;
  if (!SAFE_ATTRIBUTION.test(clean)) return undefined;
  return clean;
}

export function sanitizeAttribution(record: Record<string, unknown>): Attribution {
  const result: Attribution = {};
  for (const key of ATTRIBUTION_KEYS) {
    const value = cleanAttributionValue(record[key]);
    if (value) result[key] = value;
  }
  return result;
}

export function readAttributionFromSearch(search: string): Attribution {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  const record: Record<string, unknown> = {};
  for (const key of ATTRIBUTION_KEYS) record[key] = params.get(key);
  return sanitizeAttribution(record);
}

export function parseStoredAttribution(raw: string | null): Attribution {
  if (!raw) return {};
  try {
    const data = JSON.parse(raw) as Record<string, unknown>;
    if (!data || typeof data !== 'object') return {};
    return sanitizeAttribution(data);
  } catch {
    return {};
  }
}

function clickId(attribution: Attribution): string | undefined {
  return attribution.gclid || attribution.gbraid || attribution.wbraid;
}

/** First touch in the session. A new click id starts a new journey. */
export function mergeAttribution(existing: Attribution, incoming: Attribution): Attribution {
  if (Object.keys(incoming).length === 0) return existing;
  const incomingClick = clickId(incoming);
  const existingClick = clickId(existing);
  if (incomingClick && incomingClick !== existingClick) return { ...incoming };
  return { ...incoming, ...existing };
}

export function parseAttribution(data: { get(name: string): unknown }): Attribution {
  const record: Record<string, unknown> = {};
  for (const key of ATTRIBUTION_KEYS) record[key] = data.get(key);
  return sanitizeAttribution(record);
}

export function attributionEmailRows(data: { get(name: string): unknown }): Array<[string, string]> {
  const attribution = parseAttribution(data);
  const rows: Array<[string, string]> = [];
  for (const key of ATTRIBUTION_KEYS) {
    const value = attribution[key];
    if (value) rows.push([ATTRIBUTION_LABELS[key], value]);
  }
  return rows;
}

export function onFormSubmit(flags: LeadFlags, token: string): LeadFlags {
  return { ...flags, pending: token };
}

export function onFormError(flags: LeadFlags): LeadFlags {
  return { ...flags, pending: null };
}

export function onThanksVisit(flags: LeadFlags, successParam: boolean): LeadFlags {
  if (!successParam || !flags.pending) return flags;
  if (flags.sent === flags.pending) return { ...flags, pending: null };
  return { pending: null, ready: flags.pending, sent: flags.sent };
}

export function onFireLead(
  flags: LeadFlags,
  allowed: boolean,
): { flags: LeadFlags; fire: boolean } {
  if (!flags.ready || !allowed) return { flags, fire: false };
  if (flags.sent === flags.ready) return { flags: { ...flags, ready: null }, fire: false };
  return {
    flags: { pending: flags.pending, ready: null, sent: flags.ready },
    fire: true,
  };
}
