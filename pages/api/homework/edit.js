import withSession from "../../../lib/session";
import validate from 'validate.js';

import { query } from '../../../lib/db';

async function handler(req, res, session) {
  if (!req?.session?.get('user')) return res.status(401).send({ error: 'NOT_AUTHORIZED', success: false });

  if (!req.body.groupId) return res.status(401).send({ error: 'MISSING_PARAMETERS', success: false }); // TODO: || autre variables etc
  if (req.session.get('user').userType === 0 && req.body.groupId !== req.session.get('user')?.group?.id) return res.status(401).send({ error: 'NOT_AUTHORIZED', success: false });

  let homework = req.body;

  let errors = validate(homework, {
    content: {
      presence: true,
      length: {
        minimum: 5
      }
    },
    date: {
      presence: true
    },
    subjectId: {
      presence: true
    }
    /* Pas besoin de re-valider groupId vu qu'on vérifie déjà juste avant, et que si userType > 0 && groupId inexistant, alors on prend celui de l'utilisateur */
  });

  if (errors) return res.status(400).send({ errors, success: false });

  try {
    const results = await query(
      `
      UPDATE homework
      SET date = ?, content = ?, subjectId = ?, groupId = ?
      `,
      [homework.date, homework.content, homework.subjectId, homework.groupId || req.session.get('user')?.group?.id]
    );

    res.send({ success: true });
  }
  catch (error) {
    res.status(500).json({ error: error.message || error, success: false });
  }
}

export default withSession(handler);
