import withSession from "../../../lib/session";

import { query } from '../../../lib/db';
import { hash, verify } from '../../../lib/encryption';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function handler(req, res) {
  const user = req?.session?.get('user');
  if (!user) return res.status(401).send({ error: 'NOT_AUTHORIZED', success: false });

  try {
    let u = await query(`
      DELETE
      FROM users
      WHERE userId = ?`, [user.userId]);

    await req.session.destroy();

    res.writeHead(301, {
      'cache-control': 'no-store, max-age=0',
      Location: '/',
      'Content-Length': Buffer.byteLength('ok'),
      'Content-Type': 'text/plain'
    }).end('ok');
  }
  catch(error) {
    res.status(500).send({ error: error.message, success: false });
  }
}

export default withSession(handler);
