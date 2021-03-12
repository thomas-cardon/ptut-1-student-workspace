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
      const topic = chats[0].chatTopic;
      chat.messages = await query('SELECT * FROM `messages` WHERE `chatId` = ?', req.query.id);

      res.json(chat);
    }
    else res.status(404).json({ error: 'Chat introuvable', success: false });
  }
  catch (e) {
    res.status(500).json({ error: e.message, success: false });
  }
}

export default withSession(handler);
