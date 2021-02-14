/* next-iron-session est un module qui permet de stocker les données de session en local chez chaque client,
évitant ansi les appels inuties, et on se sert donc des cookies pour sauvegarder les données */
import { withIronSession } from "next-iron-session";
import { query } from '../../../../lib/db';

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

export default withIronSession(handler, {
  cookieName: "ptut-1/sessions/v1",
  password: process.env.SECRET_COOKIE_PASSWORD,
  // La sécurisation s'active que si Node.js n'est pas en mode développement (il est en production quand c'est Vercel qui l'héberge)
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
});
