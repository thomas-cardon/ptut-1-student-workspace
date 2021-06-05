import withSession from "../../../lib/session";
import { query } from '../../../lib/db';

import fetch from 'isomorphic-unfetch';
import { getURL } from '../../../lib/ade';

async function handler(req, res, session) {
  if (!req?.session?.get('user')) return res.status(401).send({ error: 'NOT_AUTHORIZED', success: false });

  try {
    const url = getURL(req.session.get('user'), req.query.resource);

    const results = await query(`SELECT body from ade_cache WHERE url = ?`, [url]);
    let ics;

    if (results[0]?.body) ics = results[0].body;
    else {
      const r = await fetch(url);
      ics = await r.text();

      await query(
        `
        INSERT INTO ade_cache (url, body, timestamp)
        VALUES (?, ?, ?)
        `, [url, ics, Date.now()]);
    }

    res.send(ics);
  }
  catch (e) {
    res.status(500).json({ error: 'FATAL', message: e.message, success: false });
  }
}

export default withSession(handler);
