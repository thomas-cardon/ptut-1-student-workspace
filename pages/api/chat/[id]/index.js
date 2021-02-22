import { query } from '../../../../lib/db';
import withSession from '../../../../lib/session';

async function handler(req, res) {
  if (!req.session) return res.status(401).send({ error: 'NOT_AUTHORIZED', success: false });

  const user = req.session.get('user');
  if (!user) return res.status(401).send({ error: 'NOT_AUTHORIZED', success: false });

  try {
    const chats = await query('SELECT `chatTopic` FROM `chat` WHERE `chatId` = ?', req.query.id);
    if (chats.length > 0) {
      const chat = {
        id: req.query.id,
        topic: chats[0].chatTopic
      }

      res.json(chat);
    }
    else {
      await query(`
        INSERT INTO chat (chatId, chatTopic)
        VALUES (?, ?)
      `, [req.query.id, req.body.topic || 'Chat sans titre']);

      res.json({ id: req.query.id, topic: req.body.topic || 'Chat sans titre' });
    }
  }
  catch (e) {
    res.status(500).json({ error: e.message, success: false });
  }
}

export default withSession(handler);
