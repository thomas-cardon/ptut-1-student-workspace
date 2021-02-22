import { query } from '../../../../lib/db';
import withSession from '../../../../lib/session';

async function handler(req, res) {
  const user = req.session.get('user');
  if (!user) return res.status(401).send('NOT_AUTHORIZED');

  try {
    if (req.method === 'DELETE' && user.userType == 2) { // Suppression
      const data = await query(`DELETE FROM classes WHERE module = ?`, req.query.moduleId);
      res.json({ success: true });
    }
    else if ((req.method === 'POST' || req.method === 'PUT') && user.userType == 2) {
      if (!req.query.moduleId || !req.body.name) return res.status(400).send('MISSING_PARAMETERS');
      const results = await query(
        `
        INSERT INTO classes (module, name, color)
        VALUES (?, ?, ?)
        `,
        [req.query.moduleId, req.body.name, req.body.color || null]
      );

      res.send({ success: true });
    }
    else if (req.method === 'GET') {
      const data = await query(`SELECT * FROM classes WHERE module = ?`, req.query.moduleId);

      if (data.length > 0) res.json({ module: data[0], success: true });
      else res.status(404).json({ error: 'Not found', success: false });
    }
    else res.status(401).send('NOT_AUTHORIZED');
  }
  catch (e) {
    res.status(500).json({ error: e.message, success: false });
  }
}

export default withSession(handler);
