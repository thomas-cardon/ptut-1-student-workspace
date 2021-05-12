/* next-iron-session est un module qui permet de stocker les données de session en local chez chaque client,
évitant ansi les appels inuties, et on se sert donc des cookies pour sauvegarder les données */
import withSession from "../../../lib/session";
import { query } from '../../../lib/db';

async function handler(req, res) {
  if (!req?.session?.get('user')) return res.status(401).send({ error: 'NOT_AUTHORIZED', success: false });

  try {
    const data = await query(`
      SELECT posts.id, posts.userId, subjectId, groups.name as groupName, title, content, creation_time, modification_time, firstName as authorFirstName, lastName as authorLastName, groupId FROM posts
      INNER JOIN users on posts.userId = users.userId
      INNER JOIN groups on groups.id = groupId
      WHERE posts.id = ?`, req.query.postId);

    if (data.length > 0) res.json(data[0]);
    else res.status(404).json({ message: 'NOT_FOUND', success: false });
  }
  catch (e) {
    res.status(500).json({ error: e.message, success: false });
  }
}

export default withSession(handler);
