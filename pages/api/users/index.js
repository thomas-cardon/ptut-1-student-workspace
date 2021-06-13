/* next-iron-session est un module qui permet de stocker les données de session en local chez chaque client,
évitant ansi les appels inuties, et on se sert donc des cookies pour sauvegarder les données */
import withSession from "../../../lib/session";
import { query } from '../../../lib/db';

async function handler(req, res) {
  if (!req?.session?.get('user')) return res.status(401).send({ error: 'NOT_AUTHORIZED', success: false });
  if (req?.session?.get('user').userType === 0) return res.send([]);

  try {
    const users = await query(`
      SELECT userId, email, hash, userType, firstName, lastName, birthDate, degrees.school, degreeId, groupId, groups.name AS groupName, groups.resourceId AS groupResourceId, avatar_key, avatar_value, delegate as isDelegate, isTeacher FROM users
      LEFT OUTER JOIN groups ON groups.id = users.groupId
      LEFT OUTER JOIN degrees ON users.degreeId
      ${req.query.queryUserType ? 'WHERE userType >= ' + req.query.queryUserType : ''}
      ${req.query.page && req.query.limit ? 'LIMIT ' + (req.query.page * req.query.limit) + ', ' + req.query.limit : ''}
    `);

    res.send(users.map(u => {
      if (u.groupName) {
        u.group = { id: u.groupId, name: u.groupName };
        delete u.groupId;
        delete u.groupName;
      }

      return u;
    }));
  }
  catch (e) {
    res.status(500).json({ error: e.message, success: false });
  }
}

export default withSession(handler);
