import withSession from "../../../lib/session";
import validate from 'validate.js';

import { query } from '../../../lib/db';

async function handler(req, res, session) {
  if (!req?.session?.get('user')) return res.status(401).send({ error: 'NOT_AUTHORIZED', success: false });

  let post = req.body;
  let errors = validate(addHomework, {
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
      INSERT INTO homework (timestamp, content, subjectId, groupId)
      VALUES (?, ?, ?, ?)
      `,
      [addHomework.timestamp, addHomework.content, addHomework.subjectId, addHomework.groupId]
    );

    res.send({ success: true });
  }
  catch (error) {
    res.status(500).json({ error: error.message || error, success: false });
  }
}

export default withSession(handler);
