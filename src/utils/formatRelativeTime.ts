import { formatDistanceToNow, parse } from 'date-fns';

// Formats the backend may send, e.g. "2026-06-04 04:13:13.775 +0300".
const KNOWN_FORMATS = [
  'yyyy-MM-dd HH:mm:ss.SSS xx', // "2026-06-04 04:13:13.775 +0300"
  'yyyy-MM-dd HH:mm:ss xx', // no milliseconds
  'yyyy-MM-dd HH:mm:ss.SSSxxx', // "...775+03:00"
];

const toDate = (value: string): Date | null => {
  // Native parse first (handles ISO "2026-06-04T04:13:13.775+03:00").
  const native = new Date(value);
  if (!Number.isNaN(native.getTime())) {
    return native;
  }

  for (const format of KNOWN_FORMATS) {
    const parsed = parse(value, format, new Date());
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return null;
};

/**
 * Converts a backend timestamp like "2026-06-04 04:13:13.775 +0300"
 * into a relative string like "about 3 hours ago" / "3 days ago".
 * Falls back to the raw value if it cannot be parsed.
 */
const formatRelativeTime = (value?: string | null): string => {
  if (!value) {
    return '';
  }

  const date = toDate(value);
  if (!date) {
    return value;
  }

  return formatDistanceToNow(date, { addSuffix: true });
};

export default formatRelativeTime;
