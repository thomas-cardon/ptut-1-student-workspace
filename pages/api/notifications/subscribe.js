import withSession from "../../../lib/session";
import { query } from '../../../lib/db';

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

export default withSession(handler);
