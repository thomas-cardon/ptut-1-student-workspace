/* next-iron-session est un module qui permet de stocker les données de session en local chez chaque client,
évitant ansi les appels inuties, et on se sert donc des cookies pour sauvegarder les données */
import withSession from "../../../lib/session";

import { query } from '../../../lib/db';
import { hash } from '../../../lib/encryption';

import { uni as schools } from '../../../lib/ade';

async function handler(req, res) {
  /**
   * TODO: VALIDATION
   */
  try {
    if (req.session.get('user')) return res.status(400).json({ error: 'ALREADY_AUTHENTIFIED', success: true });

    const results = await query(`
      SELECT * FROM users
      WHERE email = ?
      LIMIT 1`, [req.body.email]);

    if (results.length === 1) return res.status(400).json({ error: 'USER_ALREADY_EXISTS', message: "Un utilisateur avec cette adresse mail existe déjà.", success: false });

    const hashed = await hash(req.body.password);

    await query(`
      INSERT INTO users (firstName, lastName, email, hash, birthDate, userType, school, degree, year, groupId)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [req.body.firstName, req.body.lastName, req.body.email, hashed, req.body.birthDate, 0, req.body.school, req.body.degree, req.body.year, schools[req.body.school][req.body.degree][req.body.year].groupId]);

    await req.session.save();
    res.send({ success: true });
  }
  catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message, success: false });
  }
}

export default withSession(handler);
