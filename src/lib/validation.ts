export const trailerTypes = [
  'Båttrailer',
  'Släpvagn',
  'Maskintransportsläp',
  'Hästtransportsläp',
  'Annat',
] as const;

export type TrailerType = (typeof trailerTypes)[number];

export type ContactInput = {
  name: string;
  phone: string;
  email: string;
  regNumber: string;
  trailerType: string;
  message: string;
  company: string;
  startedAt: string;
};

export type FieldErrors = Partial<Record<keyof ContactInput, string>>;

export function cleanText(value: FormDataEntryValue | null): string {
  return String(value ?? '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .trim();
}

export function parseContactForm(data: FormData): ContactInput {
  return {
    name: cleanText(data.get('name')),
    phone: cleanText(data.get('phone')),
    email: cleanText(data.get('email')),
    regNumber: cleanText(data.get('regNumber')).toUpperCase().replace(/\s+/g, ''),
    trailerType: cleanText(data.get('trailerType')),
    message: cleanText(data.get('message')),
    company: cleanText(data.get('company')),
    startedAt: cleanText(data.get('startedAt')),
  };
}

export function validateContact(input: ContactInput): FieldErrors {
  const errors: FieldErrors = {};

  if (input.name.length < 2 || input.name.length > 80) {
    errors.name = 'Ange ditt namn.';
  }

  const phone = input.phone.replace(/[\s\-().]/g, '');
  if (!/^(\+46|0)[1-9]\d{6,12}$/.test(phone)) {
    errors.phone = 'Ange ett giltigt telefonnummer.';
  }

  if (input.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    errors.email = 'Ange en giltig e-postadress eller lämna fältet tomt.';
  }

  if (input.regNumber.length > 16) {
    errors.regNumber = 'Registreringsnumret ser för långt ut.';
  }

  if (!trailerTypes.includes(input.trailerType as TrailerType)) {
    errors.trailerType = 'Välj typ av släp.';
  }

  if (input.message.length < 10 || input.message.length > 2000) {
    errors.message = 'Beskriv kort vad du behöver hjälp med.';
  }

  return errors;
}

export function isHoneypot(input: ContactInput): boolean {
  return input.company.length > 0;
}

export function isTooFast(input: ContactInput, minMs = 3000): boolean {
  if (!input.startedAt) return false;
  const started = Number(input.startedAt);
  if (Number.isNaN(started)) return true;
  return Date.now() - started < minMs;
}
