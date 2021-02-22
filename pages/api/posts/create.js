import withSession from "../../../lib/session";
import validate from 'validate.js';

import { query } from '../../../lib/db';

async function handler(req, res, session) {
  const user = req.session.get('user');
  if (!user || user.userType == 0) return res.status(401).send('NOT_AUTHORIZED');

  let post = req.body;
  let errors = validate(post, {
    title: {
      presence: true,
      length: {
        minimum: 5
      }
    },
    content: {
      presence: true,
      length: {
        minimum: 5
      }
    }
  });

  console.dir(post);
  if (errors) return res.status(400).send({ errors, success: false });

  try {
    const results = await query(
      `
      INSERT INTO posts (title, content, userId, classId)
      VALUES (?, ?, ?, ?)
      `,
      [post.title, post.content, user.userId, post.classId]
    );

    res.send({ success: true });
  }
  catch (error) {
    res.status(500).json({ error: error.message || error, success: false });
  }
}

export default withSession(handler);
