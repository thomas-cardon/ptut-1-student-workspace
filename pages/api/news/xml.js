import withSession from "../../../lib/session";
import { query } from '../../../lib/db';

import fetch from 'isomorphic-unfetch';
import { getURL } from '../../../lib/ade';

import convert from 'xml-js';

async function handler(req, res, session) {
  if (!req?.session?.get('user')) return res.status(401).send({ error: 'NOT_AUTHORIZED', success: false });
  const { url } = req.query;

  try {
    const results = await query(`SELECT body from news_cache WHERE url = ?`, [url]);
    let data;

    if (results[0]?.body && new Date().getTime() - new Date(results[0].timestamp).getTime() >= 7 * 24 * 60 * 60 * 1000)
      return res.json(convert.xml2json(results[0].body, { compact: true }));
  }
  catch (e) {
    res.status(500).json({ error: 'FATAL', message: e.message, success: false });
  }

  try {
    const r = await fetch(url);
    const data = await r.text();

    await query(
      `
      REPLACE INTO news_cache (url, body, timestamp)
      VALUES (?, ?, ?)
      `, [url, data, Date.now()]);

    return res.json(convert.xml2json(data, { compact: true }));
  }
  catch(e) {
    res.status(500).json({ error: 'FATAL', message: e.message, success: false });
  }
}

export default withSession(handler);
