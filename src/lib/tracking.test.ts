import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  attributionEmailRows,
  consentUpdatePayload,
  conversionSendTo,
  mergeAttribution,
  onFireLead,
  onFormError,
  onFormSubmit,
  onThanksVisit,
  parseStoredConsent,
  phoneClickParams,
  readAttributionFromSearch,
  safeEventParams,
  type LeadFlags,
} from './tracking.ts';

const emptyFlags = (): LeadFlags => ({ pending: null, ready: null, sent: null });

describe('attribution', () => {
  it('keeps the first touch when later pages have no campaign data', () => {
    const first = readAttributionFromSearch('?utm_source=google&utm_medium=cpc&gclid=abc123');
    const merged = mergeAttribution(first, readAttributionFromSearch(''));
    assert.equal(merged.gclid, 'abc123');
    assert.equal(merged.utm_source, 'google');
  });

  it('starts a new journey when a different click id arrives', () => {
    const first = readAttributionFromSearch('?utm_source=google&gclid=first');
    const next = mergeAttribution(first, readAttributionFromSearch('?gclid=second&utm_campaign=b'));
    assert.equal(next.gclid, 'second');
    assert.equal(next.utm_campaign, 'b');
    assert.equal(next.utm_source, undefined);
  });

  it('drops email addresses, phone numbers and unknown fields', () => {
    const parsed = readAttributionFromSearch(
      '?utm_source=test%40example.com&utm_medium=cpc&gclid=ok_id&email=person%40example.com',
    );
    assert.equal(parsed.utm_source, undefined);
    assert.equal(parsed.utm_medium, 'cpc');
    assert.equal(parsed.gclid, 'ok_id');
    assert.equal('email' in parsed, false);
  });

  it('reads only allow-listed fields from form data', () => {
    const form = new FormData();
    form.set('name', 'Ada');
    form.set('email', 'ada@example.com');
    form.set('message', 'Hjullager låter');
    form.set('gclid', 'click123');
    form.set('utm_source', 'google');
    const rows = attributionEmailRows(form);
    assert.deepEqual(rows, [
      ['Källa (utm_source)', 'google'],
      ['Google-klick-id (gclid)', 'click123'],
    ]);
  });
});

describe('consent', () => {
  it('reads the previous ads_consent values', () => {
    assert.equal(parseStoredConsent('1').ads, 'granted');
    assert.equal(parseStoredConsent('0').ads, 'denied');
    assert.equal(parseStoredConsent(null).ads, null);
  });

  it('keeps analytics denied when GA4 is not configured', () => {
    const payload = consentUpdatePayload({ ads: 'granted', analytics: 'granted' }, false);
    assert.equal(payload.ad_storage, 'granted');
    assert.equal(payload.ad_user_data, 'granted');
    assert.equal(payload.ad_personalization, 'granted');
    assert.equal(payload.analytics_storage, 'denied');
  });

  it('grants analytics storage only when GA4 is configured and allowed', () => {
    const payload = consentUpdatePayload({ ads: 'denied', analytics: 'granted' }, true);
    assert.equal(payload.ad_storage, 'denied');
    assert.equal(payload.analytics_storage, 'granted');
  });
});

describe('lead conversion', () => {
  it('fires once after a successful submit and not on refresh', () => {
    let flags = onFormSubmit(emptyFlags(), 'token-a');
    flags = onThanksVisit(flags, true);
    const first = onFireLead(flags, true);
    assert.equal(first.fire, true);
    const refresh = onThanksVisit(first.flags, false);
    const second = onFireLead(refresh, true);
    assert.equal(second.fire, false);
  });

  it('does not fire for a failed submit or a bare thank-you visit', () => {
    const failed = onFormError(onFormSubmit(emptyFlags(), 'token-a'));
    assert.equal(onFireLead(onThanksVisit(failed, false), true).fire, false);
    assert.equal(onFireLead(onThanksVisit(emptyFlags(), true), true).fire, false);
  });

  it('waits for consent and still fires only once', () => {
    const ready = onThanksVisit(onFormSubmit(emptyFlags(), 'token-a'), true);
    const waiting = onFireLead(ready, false);
    assert.equal(waiting.fire, false);
    assert.equal(waiting.flags.ready, 'token-a');
    const fired = onFireLead(waiting.flags, true);
    assert.equal(fired.fire, true);
    assert.equal(onFireLead(fired.flags, true).fire, false);
  });
});

describe('phone clicks', () => {
  it('keeps only a non-sensitive location', () => {
    assert.deepEqual(phoneClickParams('header'), { location: 'header' });
    assert.deepEqual(phoneClickParams('secret'), { location: 'other' });
    assert.deepEqual(safeEventParams({ location: 'footer', email: 'a@b.se', phone: '070' }), {
      location: 'footer',
    });
  });
});

describe('conversion destination', () => {
  it('returns null when the id or label is missing', () => {
    assert.equal(conversionSendTo('AW-123', ''), null);
    assert.equal(conversionSendTo('', 'abc'), null);
    assert.equal(conversionSendTo('AW-123', 'abc'), 'AW-123/abc');
  });
});
