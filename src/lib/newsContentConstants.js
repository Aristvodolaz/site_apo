/** Лимит Firestore на значение поля ~1 MiB; запас под остальные поля документа. */
export const MAX_INLINE_NEWS_CONTENT_BYTES = 900000;

/** Длина строки в байтах UTF-8 (как считает Firestore). */
export function getUtf8ByteLength(str) {
  return new TextEncoder().encode(str).length;
}
