import { db } from '../../../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

/** Отдаёт HTML тела новости (из Firestore или по contentUrl с S3) — сервером, без CORS в браузере. */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).send('');
  }

  const rawId = req.query.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  if (!id || typeof id !== 'string') {
    return res.status(400).send('');
  }

  if (!db) {
    return res.status(500).send('');
  }

  try {
    const snap = await getDoc(doc(db, 'news', id));
    if (!snap.exists()) {
      return res.status(404).send('');
    }

    const data = snap.data();
    let html = '';

    if (data.contentUrl) {
      const r = await fetch(data.contentUrl);
      if (!r.ok) {
        return res.status(502).send('');
      }
      html = await r.text();
    } else {
      html = data.content != null ? String(data.content) : '';
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    return res.status(200).send(html);
  } catch (error) {
    console.error('article-html:', error);
    return res.status(500).send('');
  }
}
