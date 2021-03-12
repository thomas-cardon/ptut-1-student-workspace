import withSession from '../../../lib/session';
import { query } from '../../../lib/db';

async function handler(req, res) {
  if (!req?.session?.get('user')) return res.status(401).send({ error: 'NOT_AUTHORIZED', success: false });
  const user = req.session.get('user');

  try {
    if (req.method === 'DELETE' && user.userType === 2) { // Suppression
      const data = await query(`DELETE FROM schedule WHERE id = ?`, req.query.courseId);
      res.json({ success: true });
    }
    else if (req.method === 'PATCH' && user.userType === 2) { // Modification
      let q = 'UPDATE schedule SET ' + Object.keys(req.body).map((x, i, arr) => {
        if (arr.length - 1 === i) {
          return x + ' = ? WHERE id = ?'
        }
        else return x + ' = ?, ';
      });

      const data = await query(q, [...Object.values(req.body), req.query.courseId]);
      res.json({ success: true });
    }
    else res.status(401).send({ success: false, error: 'NOT_AUTHORIZED' });
  }
  catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message, success: false });
  }
}

export default withSession(handler);
