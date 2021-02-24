import withSession from '../../../lib/session';
import { query } from '../../../lib/db';

async function handler(req, res) {
  const user = req.session.get('user');
  if (!user) return res.status(401).send('NOT_AUTHORIZED');

  try {
    if (req.method === 'DELETE' && user.userType == 2) { // Suppression
      const data = await query(`DELETE FROM schedule WHERE id = ?`, req.query.courseId);
      res.json({ success: true });
    }
    else res.status(401).send('NOT_AUTHORIZED');
  }
  catch (e) {
    res.status(500).json({ error: e.message, success: false });
  }
}

export default withSession(handler);
