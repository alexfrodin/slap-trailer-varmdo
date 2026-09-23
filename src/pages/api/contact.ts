import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { verifyTurnstile } from '../../lib/turnstile';
import { attributionEmailRows } from '../../lib/tracking';
import {
  isHoneypot,
  isTooFast,
  parseContactForm,
  validateContact,
} from '../../lib/validation';

export const prerender = false;

function redirectTo(path: string, request: Request) {
  return new Response(null, {
    status: 303,
    headers: { Location: new URL(path, request.url).toString() },
  });
}

function refererPath(request: Request): string {
  const referer = request.headers.get('referer');
  if (!referer) return '/kontakt';
  try {
    const url = new URL(referer);
    return `${url.pathname}${url.hash || '#forfragan'}`;
  } catch {
    return '/kontakt#forfragan';
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export const POST: APIRoute = async ({ request }) => {
  const fail = (code: string) => {
    const path = refererPath(request).split('?')[0];
    return redirectTo(`${path}?fel=${code}#forfragan`, request);
  };

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail('server');
  }

  const input = parseContactForm(form);

  if (isHoneypot(input)) {
    return redirectTo('/tack', request);
  }

  if (isTooFast(input)) {
    return fail('spam');
  }

  const errors = validateContact(input);
  if (Object.keys(errors).length > 0) {
    return fail('validering');
  }

  const turnstileToken =
    (form.get('cf-turnstile-response') as string | null) ?? undefined;
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip');
  const turnstileOk = await verifyTurnstile(turnstileToken, ip);
  if (!turnstileOk) {
    return fail('spam');
  }

  const apiKey = import.meta.env.RESEND_API_KEY;
  const to = import.meta.env.CONTACT_TO_EMAIL;
  const from = import.meta.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    if (import.meta.env.DEV) {
      console.info('Contact form (dev, email not configured)', {
        name: input.name,
        phone: input.phone,
        trailerType: input.trailerType,
      });
      return redirectTo('/tack?skickad=1', request);
    }
    return fail('server');
  }

  const rows = [
    ['Namn', input.name],
    ['Telefon', input.phone],
    ['E-post', input.email || '–'],
    ['Registreringsnummer', input.regNumber || '–'],
    ['Typ av släp', input.trailerType],
    ['Meddelande', input.message],
    ...attributionEmailRows(form),
  ];

  const text = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
  const html = `
    <h1>Ny serviceförfrågan</h1>
    ${rows
      .map(
        ([label, value]) =>
          `<p><strong>${escapeHtml(label)}:</strong><br>${escapeHtml(value).replaceAll('\n', '<br>')}</p>`,
      )
      .join('')}
  `;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      subject: `Förfrågan: ${input.trailerType} — ${input.name}`,
      text,
      html,
      replyTo: input.email || undefined,
    });
    if (error) {
      console.error('Resend error');
      return fail('server');
    }
  } catch {
    return fail('server');
  }

  return redirectTo('/tack?skickad=1', request);
};
