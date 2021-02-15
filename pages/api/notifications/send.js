import { withIronSession } from 'next-iron-session';
import validate from 'validate.js';

import { query } from '../../../lib/db';
import { hash } from '../../../lib/encryption';

async function handler(req, res, session) {
  const user = req.session.get('user');
  if (!user || user.userType == 0) return res.status(401).send({ message: 'NOT_AUTHORIZED', success: false });

  try {
    const { title, body } = req.query;
    const webpush = require('web-push');

    const vapidKeys = {
      publicKey: process.env.VAPID_PUBLIC_KEY,
      privateKey: process.env.VAPID_PRIVATE_KEY,
    }
    //setting our previously generated VAPID keys
    webpush.setVapidDetails(
      'mailto:thomas.cardon@pm.me',
      vapidKeys.publicKey,
      vapidKeys.privateKey
    )

    const subscriptions = await query('SELECT * FROM `subscriptions`');
    for (let sub of subscriptions) {
      webpush.sendNotification(JSON.parse(sub.subscriptions), body || 'Notification vide');
    }

    res.send({ success: true });
  }
  catch(error) {
    console.error(error);
    res.status(500).json({ message: error, success: false });
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
