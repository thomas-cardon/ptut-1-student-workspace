import withSession from "../../../lib/session";
import { query } from '../../../lib/db';

async function handler(req, res, session) {
  if (!req?.session?.get('user')) return res.status(401).send({ error: 'NOT_AUTHORIZED', success: false });
  if (!req.session.get('user').group?.id) return res.send({ homework: [], success: true });

  if (req.method === 'DELETE' /* && Vérifier que l'utilisateur à bien le droit de supprimer */) { // Suppression
    const data = await query(`DELETE FROM homework WHERE id = ?`, req.query.id);
    res.json({ success: true });
  }

  try {
    const data = await query(
      `
      SELECT homework.id, date, content, subjects.module, subjects.name, homework.groupId
      FROM homework
      INNER JOIN subjects ON homework.subjectId = subjects.id
      WHERE homework.groupId = ?
      ORDER BY date ASC
      `, [req.session.get('user').group.id]);

    res.json(data);

  }
  catch (e) {
    res.status(500).json({ message: e.message, success: false });
  }
}

export default withSession(handler);
