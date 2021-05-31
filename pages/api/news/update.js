import withSession from "../../../lib/session";
import { db, query } from '../../../lib/db';

import { feeds } from '../../../lib/news';

import { xml2js } from 'xml-js';
import fetch from 'isomorphic-unfetch';

async function handler(req, res, session) {
  //if (req.getHeader('sws-secret') !== process.env.SWS_CRON_SECRET) return res.status(401).send({ error: 'NOT_AUTHORIZED', success: false });

  let news = [];
  for (let feed of feeds) {
    const r = await fetch(feed.url);

    if (!r.ok) return console.error(`[${feed.name}] Impossible d'effectuer la requête`);

    try {
      const data = xml2js(await r.text(), { compact: true });
      news = news.concat(feed.parse(data));
    }
    catch(error) {
      console.error(`[${feed.name}] Une erreur s'est produite`);
      console.error(error);
    }
  }

  try {
    await query(`INSERT INTO news (title, description, author, href, created) VALUES ?`, [
      ...news.map(x => [
        x.title,
        x.description,
        x.author,
        x.href,
        x.created
      ])
    ]);

    res.json({ success: true });
  }
  catch (e) {
    res.status(500).json({ error: 'FATAL', message: e.message, success: false });
  }
}

export default withSession(handler);
