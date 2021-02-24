import withSession from "../../../lib/session";
import { query } from '../../../lib/db';

async function handler(req, res, session) {
  const user = req.session.get('user');
  if (!user) return res.status(401).send({ message: 'NOT_AUTHORIZED', success: false });

  const { subscription } = req.body;
  if (!subscription) return res.status(404).send({ message: 'NOT_FOUND', success: false });

  try {
    const results = await query(
      `
      UPDATE users
      SET subscription = ?
      WHERE userId = ?
      `,
      [JSON.stringify(subscription), user.userId]
    );

    res.send({ success: true });
  }
  catch (e) {
    res.status(500).json({ message: e.message, success: false });
  }
}

export default withSession(handler);
