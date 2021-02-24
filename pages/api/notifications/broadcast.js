import withSession from "../../../lib/session";
import { query } from '../../../lib/db';

async function handler(req, res, session) {
  const user = req.session.get('user');
  if (!user || user.userType == 0) return res.status(401).send({ message: 'NOT_AUTHORIZED', success: false });

  try {
    const { title, body } = req.query;
    const webpush = require('web-push');

    const vapidKeys = {
      publicKey: process.env.VAPID_PUBLIC_KEY,
      privateKey: process.env.VAPID_PRIVATE_KEY,
    };

    //setting our previously generated VAPID keys
    webpush.setVapidDetails(
      'mailto:thomas.cardon@pm.me',
      vapidKeys.publicKey,
      vapidKeys.privateKey
    );

    const subscriptions = await query('SELECT subscription FROM users WHERE subscription IS NOT NULL');

    for (let o of subscriptions)
      webpush.sendNotification(JSON.parse(o.subscription), `${title}|${body}`);

    res.send({ length: subscriptions.length, success: true });
  }
  catch(error) {
    console.error(error);
    res.status(500).json({ message: error, success: false });
  }
}

export default withSession(handler);
