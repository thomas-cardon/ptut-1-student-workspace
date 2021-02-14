/* next-iron-session est un module qui permet de stocker les données de session en local chez chaque client,
évitant ansi les appels inuties, et on se sert donc des cookies pour sauvegarder les données */
import { withIronSession } from "next-iron-session";
import { query } from '../../../../lib/db';

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

export default withIronSession(handler, {
  cookieName: "ptut-1/sessions/v1",
  password: process.env.SECRET_COOKIE_PASSWORD,
  // La sécurisation s'active que si Node.js n'est pas en mode développement (il est en production quand c'est Vercel qui l'héberge)
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
});
