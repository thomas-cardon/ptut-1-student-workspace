import withSession from "../../../../lib/session";
import { query } from '../../../../lib/db';

async function handler(req, res) {
  try {
    const users = await query(`SELECT firstName, lastName, resourceId FROM users WHERE isTeacher = 1`);

    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');
    res.send(users);
  }
  catch (e) {
    res.status(500).json({ error: e.message, success: false });
  }
}

export default withSession(handler);
