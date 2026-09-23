import {
  ga4MeasurementId,
  googleAdsId,
  googleAdsLeadLabel,
  googleAdsPhoneLabel,
  googleTrackingEnabled,
} from './google-config';
import {
  ATTRIBUTION_KEYS,
  GA4_LEAD_EVENT,
  LEAD_EVENT,
  PHONE_EVENT,
  type Attribution,
  type ConsentChoice,
  type LeadFlags,
  consentUpdatePayload,
  conversionSendTo,
  hasConsentChoice,
  mergeAttribution,
  onFireLead,
  onFormError,
  onFormSubmit,
  onThanksVisit,
  parseStoredAttribution,
  parseStoredConsent,
  phoneClickParams,
  readAttributionFromSearch,
  safeEventParams,
  serializeConsent,
} from './tracking';

const CONSENT_KEY = 'ads_consent';
const ATTRIBUTION_KEY = 'stv_attribution';
const LEAD_PENDING_KEY = 'stv_lead_pending';
const LEAD_READY_KEY = 'stv_lead_ready';
const LEAD_SENT_KEY = 'stv_lead_sent';

const leadSendTo = conversionSendTo(googleAdsId, googleAdsLeadLabel);
const phoneSendTo = conversionSendTo(googleAdsId, googleAdsPhoneLabel);

let leadFiring = false;
let lastPhone = { at: 0, href: '' };

function storageGet(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function storageSet(key: string, value: string | null) {
  try {
    if (value == null) sessionStorage.removeItem(key);
    else sessionStorage.setItem(key, value);
  } catch {
    /* Storage can be blocked. Tracking must not break the page. */
  }
}

function localGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function localSet(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* Ignore quota and privacy-mode failures. */
  }
}

function callGtag(...args: unknown[]): boolean {
  try {
    if (typeof window.gtag !== 'function') return false;
    window.gtag(...args);
    return true;
  } catch {
    return false;
  }
}

export function readConsent() {
  return parseStoredConsent(localGet(CONSENT_KEY));
}

function writeConsent(ads: ConsentChoice, analytics: ConsentChoice) {
  localSet(CONSENT_KEY, serializeConsent({ ads, analytics }));
  callGtag('consent', 'update', consentUpdatePayload({ ads, analytics }, Boolean(ga4MeasurementId)));
}

function canSendAds(): boolean {
  return Boolean(googleAdsId) && readConsent().ads === 'granted';
}

function canSendAnalytics(): boolean {
  return Boolean(ga4MeasurementId) && readConsent().analytics === 'granted';
}

function loadGoogleTag() {
  if (!googleTrackingEnabled || document.getElementById('gtag-src')) return;
  const id = googleAdsId || ga4MeasurementId;
  if (!id) return;
  const src = document.createElement('script');
  src.id = 'gtag-src';
  src.async = true;
  src.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(src);
  callGtag('js', new Date());
  if (googleAdsId) {
    callGtag('config', googleAdsId, { allow_enhanced_conversions: false });
  }
  if (ga4MeasurementId) {
    callGtag('config', ga4MeasurementId);
  }
}

export function trackEvent(name: string, params?: Record<string, string>) {
  if (!canSendAds() && !canSendAnalytics()) return;
  if (!params) {
    callGtag('event', name);
    return;
  }
  callGtag('event', name, safeEventParams(params));
}

function sendLeadEvents() {
  trackEvent(LEAD_EVENT);
  if (canSendAnalytics()) trackEvent(GA4_LEAD_EVENT);
  if (canSendAds() && leadSendTo) {
    callGtag('event', 'conversion', { send_to: leadSendTo });
  }
}

export function trackPhoneClick(location: string | null) {
  if (!canSendAds() && !canSendAnalytics()) return;
  trackEvent(PHONE_EVENT, phoneClickParams(location));
  if (canSendAds() && phoneSendTo) {
    callGtag('event', 'conversion', {
      send_to: phoneSendTo,
      transport_type: 'beacon',
    });
  }
}

function readFlags(): LeadFlags {
  return {
    pending: storageGet(LEAD_PENDING_KEY),
    ready: storageGet(LEAD_READY_KEY),
    sent: storageGet(LEAD_SENT_KEY),
  };
}

function writeFlags(flags: LeadFlags) {
  storageSet(LEAD_PENDING_KEY, flags.pending);
  storageSet(LEAD_READY_KEY, flags.ready);
  storageSet(LEAD_SENT_KEY, flags.sent);
}

export function captureAttribution() {
  try {
    const incoming = readAttributionFromSearch(window.location.search);
    const existing = parseStoredAttribution(storageGet(ATTRIBUTION_KEY));
    const merged = mergeAttribution(existing, incoming);
    storageSet(ATTRIBUTION_KEY, JSON.stringify(merged));
  } catch {
    /* Ignore malformed storage. */
  }
}

function readAttribution(): Attribution {
  return parseStoredAttribution(storageGet(ATTRIBUTION_KEY));
}

export function fillAttributionInputs(form: HTMLFormElement) {
  const stored = readAttribution();
  for (const key of ATTRIBUTION_KEYS) {
    const input = form.querySelector<HTMLInputElement>(`input[name="${key}"]`);
    if (input) input.value = stored[key] ?? '';
  }
}

function newToken(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
  } catch {
    /* Fall through. */
  }
  return `${Date.now()}`;
}

export function bindContactFormTracking(form: HTMLFormElement | null) {
  if (!form || form.dataset.trackingBound === '1') return;
  form.dataset.trackingBound = '1';

  if (new URLSearchParams(window.location.search).has('fel')) {
    writeFlags(onFormError(readFlags()));
  }

  form.addEventListener('submit', () => {
    captureAttribution();
    fillAttributionInputs(form);
    if (!googleTrackingEnabled) return;
    writeFlags(onFormSubmit(readFlags(), newToken()));
  });
}

export function maybeFireLeadConversion() {
  if (leadFiring) return;
  const decision = onFireLead(readFlags(), canSendAds() || canSendAnalytics());
  if (!decision.fire) {
    writeFlags(decision.flags);
    return;
  }
  if (typeof window.gtag !== 'function') return;
  leadFiring = true;
  writeFlags(decision.flags);
  sendLeadEvents();
  leadFiring = false;
}

function prepareThanksPage() {
  const url = new URL(window.location.href);
  const success = url.searchParams.get('skickad') === '1';
  if (success) {
    url.searchParams.delete('skickad');
    const next = `${url.pathname}${url.search}${url.hash}`;
    window.history.replaceState({}, '', next);
  }
  writeFlags(onThanksVisit(readFlags(), success));
}

function consentBanner(): HTMLElement | null {
  return document.getElementById('ads-consent');
}

function showConsent(mode: 'choice' | 'settings') {
  const banner = consentBanner();
  if (!banner) return;
  const choice = banner.querySelector<HTMLElement>('[data-consent-choice]');
  const settings = banner.querySelector<HTMLElement>('[data-consent-settings]');
  if (choice) choice.hidden = mode !== 'choice';
  if (settings) settings.hidden = mode !== 'settings';
  banner.classList.remove('hidden');
  banner.removeAttribute('aria-hidden');

  if (mode === 'settings') {
    const stored = readConsent();
    const ads = banner.querySelector<HTMLInputElement>('[data-consent-ads]');
    const analytics = banner.querySelector<HTMLInputElement>('[data-consent-analytics]');
    if (ads) ads.checked = stored.ads === 'granted';
    if (analytics) analytics.checked = stored.analytics === 'granted';
    (ads ?? banner.querySelector('button'))?.focus();
  }
}

function hideConsent() {
  const banner = consentBanner();
  if (!banner) return;
  banner.classList.add('hidden');
  banner.setAttribute('aria-hidden', 'true');
}

function grantSelected(ads: boolean, analytics: boolean) {
  writeConsent(ads ? 'granted' : 'denied', analytics ? 'granted' : 'denied');
  if (ads || (analytics && ga4MeasurementId)) loadGoogleTag();
  hideConsent();
  maybeFireLeadConversion();
}

function bindInteractions() {
  document.addEventListener(
    'click',
    (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      if (target.closest('[data-ads-accept]')) {
        grantSelected(true, Boolean(ga4MeasurementId));
        return;
      }

      if (target.closest('[data-ads-deny]')) {
        grantSelected(false, false);
        return;
      }

      if (target.closest('[data-ads-settings]')) {
        showConsent('settings');
        return;
      }

      if (target.closest('[data-ads-save]')) {
        const banner = consentBanner();
        const ads = banner?.querySelector<HTMLInputElement>('[data-consent-ads]')?.checked ?? false;
        const analytics =
          banner?.querySelector<HTMLInputElement>('[data-consent-analytics]')?.checked ?? false;
        grantSelected(ads, analytics);
        return;
      }

      if (target.closest('[data-consent-open]')) {
        showConsent('settings');
        return;
      }

      const link = target.closest('a[href^="tel:"]');
      if (!link) return;
      const href = link.getAttribute('href') ?? '';
      const now = Date.now();
      if (href === lastPhone.href && now - lastPhone.at < 800) return;
      lastPhone = { at: now, href };
      trackPhoneClick(link.getAttribute('data-phone-location'));
    },
    true,
  );
}

export function initTracking() {
  const win = window as Window & { __stvTrackingInit?: boolean };
  if (win.__stvTrackingInit) return;
  win.__stvTrackingInit = true;

  captureAttribution();
  if (!googleTrackingEnabled) return;

  bindInteractions();

  const path = window.location.pathname.replace(/\/$/, '') || '/';
  if (path === '/tack') prepareThanksPage();

  const stored = readConsent();
  if (stored.ads === 'granted' || stored.analytics === 'granted') {
    writeConsent(
      stored.ads === 'granted' ? 'granted' : 'denied',
      stored.analytics === 'granted' ? 'granted' : 'denied',
    );
    loadGoogleTag();
    maybeFireLeadConversion();
    return;
  }

  if (!hasConsentChoice(stored)) showConsent('choice');
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
