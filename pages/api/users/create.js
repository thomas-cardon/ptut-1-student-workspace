import withSession from "../../../lib/session";
import validate from 'validate.js';

import { query } from '../../../lib/db';
import { hash } from '../../../lib/encryption';

async function handler(req, res, session) {
  const user = req.session.get('user');
  if (!user || user.userType == 0) return res.status(401).send({ message: 'NOT_AUTHORIZED', success: false });

  let userCreated = { ...req.body, ...req.query };

  console.dir(userCreated);

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

  if (errors) return res.status(400).send({ errors, success: false });

  try {
    const results = await query(
      `
      INSERT INTO users (firstName, lastName, email, hash, birthDate, userType)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [userCreated.firstName, userCreated.lastName, userCreated.email, await hash(userCreated.password), userCreated.birthDate, userCreated.userType || 0, userCreated?.groupId]
    );

    res.send({ success: true });
  }
  catch (e) {
    res.status(500).json({ message: e.message, success: false });
  }
}

export default withSession(handler);
