/* next-iron-session est un module qui permet de stocker les données de session en local chez chaque client,
évitant ansi les appels inuties, et on se sert donc des cookies pour sauvegarder les données */
import withSession from "../../../lib/session";
import { query } from '../../../lib/db';

async function handler(req, res) {
  const user = req.session.get('user');
  if (!user) return res.status(401).send('NOT_AUTHORIZED');

  try {
    const users = await query(`
      SELECT userId, email, userType, firstName, lastName, birthDate, groupId, groups.name AS groupName FROM users
      LEFT OUTER JOIN groups ON groups.id = users.groupId
      ${req.query.queryUserType ? 'WHERE userType >= ' + req.query.queryUserType : ''}
    `);

    if (users.length > 0) res.send({ users: users.map(u => {
      u.group = { id: u.groupId, name: u.groupName };
      delete u.groupId;
      delete u.groupName;

      return u;
    }), success: true });
    else res.status(404).send({ message: 'NOT_FOUND', success: false });
  }
  catch (e) {
    res.status(500).json({ error: e.message, success: false });
  }
}

export default withSession(handler);