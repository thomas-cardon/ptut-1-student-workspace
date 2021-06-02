import withSession from '../../../lib/session';
import { query } from '../../../lib/db';

async function handler(req, res) {
  if (!req?.session?.get('user')) return res.status(401).send({ error: 'NOT_AUTHORIZED', success: false });

  try {
    const groups = await query(`SELECT * from groups WHERE degree = ?`, [req.session.get('user').degree]);

    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');
    res.json(groups);
  }
  catch (e) {
    res.status(500).json({ error: e.message, success: false });
  }
}

export default withSession(handler);
