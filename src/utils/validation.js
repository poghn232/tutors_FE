const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const VIETNAMESE_PHONE_PATTERN = /^0[35789]\d{8}$/;

export function isValidEmail(value) {
  return EMAIL_PATTERN.test(String(value ?? '').trim());
}

export function normalizePhone(value) {
  const compact = String(value ?? '')
    .trim()
    .replace(/[\s().-]/g, '');

  if (compact.startsWith('+84')) {
    return `0${compact.slice(3)}`;
  }

  if (compact.startsWith('84')) {
    return `0${compact.slice(2)}`;
  }

  return compact;
}

export function isValidPhone(value) {
  const normalized = normalizePhone(value);
  return normalized === '' || VIETNAMESE_PHONE_PATTERN.test(normalized);
}
