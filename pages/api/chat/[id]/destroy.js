import { query } from '../../../../lib/db';
import withSession from '../../../../lib/session';

async function handler(req, res) {
  if (!req.session) return res.status(401).send({ error: 'NOT_AUTHORIZED', success: false });

  const user = req.session.get('user');
  if (!user || user.userType != 2) return res.status(401).send({ error: 'NOT_AUTHORIZED', success: false });

  try {
    const chats = await query('DELETE FROM `chat` WHERE `chatId` = ?', req.query.id);
    res.json({ success: true });
  }
  catch (e) {
    res.status(500).json({ error: e.message, success: false });
  }
}

export default withSession(handler);
