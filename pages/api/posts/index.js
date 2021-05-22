import withSession from "../../../lib/session";
import { query } from '../../../lib/db';

async function handler(req, res, session) {
  if (!req?.session?.get('user')) return res.status(401).send({ error: 'NOT_AUTHORIZED', success: false });

  try {
    const data = await query(
      `
      SELECT posts.id, posts.userId, title, content, courseId, creation_time, module, subjects.name as subjectName, subjectId, firstName, lastName, email, userType, avatar_key, avatar_value FROM posts
      INNER JOIN subjects ON posts.subjectId = subjects.id
      INNER JOIN users ON users.userId = posts.userId
      ${req.query.module ? 'WHERE module = "' + req.query.module + '"' : ''}
      ORDER BY creation_time DESC
      LIMIT 10
      `
    );

    if (data.length > 0) res.send(data);
    else res.status(404).send({ message: 'NOT_FOUND', success: false });
  }
  catch (e) {
    res.status(500).json({ message: e.message, success: false });
  }
}

export default withSession(handler);
