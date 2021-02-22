import withSession from '../../../../lib/session';
import { query } from '../../../../lib/db';

async function handler(req, res) {
  const user = req.session.get('user');
  if (!user) return res.status(401).send({ message: 'NOT_AUTHORIZED', success: false });

  try {
    if (req.method === 'DELETE' && user.userType == 2) { // Suppression
      const data = await query(`DELETE FROM users WHERE userId = ?`, req.query.userId);
      res.json({ success: true });
    }
    else if ((req.method === 'POST' || req.method === 'PUT') && user.userType == 2) {
      res.send({ success: false });
    }
    else if (req.method === 'GET') {
      res.send({ success: false });
    }
    else res.send({ success: false });
  }
  catch (e) {
    res.status(500).json({ error: e.message, success: false });
  }
}

export default withSession(handler);
