import withSession from "../../../lib/session";
import { query } from '../../../lib/db';

async function handler(req, res, session) {
  const user = req.session.get('user');
  if (!user || user.userType == 0) return res.status(401).send('NOT_AUTHORIZED');

  try {
    const data = await query(
      `
      SELECT posts.id, posts.userId, title, content, isHomework, homeworkDate, courseId, creation_time, module, classes.name as moduleName, classId, firstName, lastName, email, userType FROM posts
      INNER JOIN subjects ON posts.subjectId = subjects.id
      INNER JOIN users ON users.userId = posts.userId
      ${req.query.module ? 'WHERE module = "' + req.query.module + '"' : ''}
      ORDER BY creation_time DESC
      LIMIT 10
      `
    );

    if (data.length > 0) res.send({ data, success: true });
    else res.status(404).send({ message: 'NOT_FOUND', success: false });
  }
  catch (e) {
    res.status(500).json({ message: e.message, success: false });
  }
}

export default withSession(handler);
