import { withIronSession } from 'next-iron-session';
import validate from 'validate.js';

import { query } from '../../../lib/db';
import { hash } from '../../../lib/encryption';

async function handler(req, res, session) {
  const user = req.session.get('user');
  if (!user || user.userType == 0) return res.status(401).send({ message: 'NOT_AUTHORIZED', success: false });

  const subscription = req.body;

  if (!subscription) return res.status(404).send({ message: 'NOT_FOUND', success: false });

  console.dir(user);

  try {
    const results = await query(
      `
      REPLACE INTO subscriptions (userId, subscriptions)
      VALUES (?, ?)
      `,
      [user.userId, JSON.stringify(subscription)]
    );

    res.send({ success: true });
  }
  catch (e) {
    res.status(500).json({ message: e.message, success: false });
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
