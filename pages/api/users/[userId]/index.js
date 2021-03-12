import withSession from '../../../../lib/session';
import { query } from '../../../../lib/db';
import validate from 'validate.js';

async function handler(req, res) {
  if (!req?.session?.get('user')) return res.status(401).send({ error: 'NOT_AUTHORIZED', success: false });

  try {
    if (req.method === 'DELETE' && user.userType == 2) { // Suppression
      const data = await query(`DELETE FROM users WHERE userId = ?`, req.query.userId);
      res.json({ success: true });
    }
    else if ((req.method === 'PUT') && user.userType == 2) {
      let userCreated = { ...req.body, ...req.query };

      let errors = validate(userCreated, {
        email: {
          presence: true,
          email: true
        },
        firstName: {
          presence: true
        },
        lastName: {
          presence: true
        },
        password: {
          presence: true,
          length: {
            minimum: 5
          }
        },
        userType: {
          presence: true
        },
        birthDate: {
          presence: true
        }
      });

      await query(`
        REPLACE INTO users(userId, firstName, lastName, email, birthDate, userType, groupId)
        VALUES (?, ?, ?, ?, ?, ?, ?)`, [userCreated.userId, userCreated.firstName, userCreated.lastName, userCreated.email, userCreated.birthDate, userCreated.userType || 0, userCreated?.groupId == 0 ? null : userCreated?.groupId]);

      res.send({ id: userCreated.userId, success: true });
    }
    else if (req.method === 'GET') {
      const users = await query(`
        SELECT userId, email, userType, firstName, lastName, birthDate, groupId, groups.name AS groupName FROM users
        LEFT OUTER JOIN groups ON groups.id = users.groupId
        WHERE userId = ?`, req.query.userId);

      if (users.length > 0) {
        users[0].group = { id: users[0].groupId, name: users[0].groupName };
        delete users[0].groupId;
        delete users[0].groupName;

        res.send({ user: users[0], success: true });
      }
      else res.status(404).send({ message: 'NOT_FOUND', success: false });
    }
    else res.send({ success: false });
  }
  catch (e) {
    res.status(500).json({ error: e.message, success: false });
  }
}

export default withSession(handler);
