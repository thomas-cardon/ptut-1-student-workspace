import { withIronSession } from 'next-iron-session';
import validate from 'validate.js';

import { query } from '../../../lib/db';
import { hash } from '../../../lib/encryption';

async function handler(req, res, session) {
  if (!req.session) return res.status(401).send('NOT_AUTHORIZED');

  const user = req.session.get('user');
  if (!user || user.userType == 0) return res.status(401).send('NOT_AUTHORIZED');

  let userCreated = req.query;

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
      [userCreated.firstName, userCreated.lastName, userCreated.email, await hash(userCreated.password), userCreated.birthDate, userCreated.userType || 0]
    );

    res.send('ok');
  }
  catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export default withIronSession(handler, {
  cookieName: "ptut-1/sessions/v1",
  password: process.env.SECRET_COOKIE_PASSWORD,
  // La sécurisation s'active que si Node.js n'est pas en mode développement (il est en production quand c'est Vercel qui l'héberge)
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
});
