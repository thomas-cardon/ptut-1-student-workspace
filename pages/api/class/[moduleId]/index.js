/* next-iron-session est un module qui permet de stocker les données de session en local chez chaque client,
évitant ansi les appels inuties, et on se sert donc des cookies pour sauvegarder les données */
import { withIronSession } from "next-iron-session";
import { query } from '../../../../lib/db';

async function handler(req, res) {
  const user = req.session.get('user');
  if (!user) return res.status(401).send('NOT_AUTHORIZED');

  try {
    if (req.method === 'DELETE' && user.userType == 2) { // Suppression
      const data = await query(`DELETE FROM classes WHERE moduleId = ?`, req.query.moduleId);
      res.json({ success: true });
    }
    else if ((req.method === 'POST' || req.method === 'PUT') && user.userType == 2) {
      if (!req.query.moduleId || !req.body.name) return res.status(400).send('MISSING_PARAMETERS');
      const results = await query(
        `
        INSERT INTO classes (moduleId, name)
        VALUES (moduleId, name)
        `,
        [req.query.moduleId, req.body.name]
      );

      res.send({ success: true });
    }
    else if (req.method === 'GET') {
      const data = await query(`SELECT * FROM classes WHERE moduleId = ?`, req.query.moduleId);

      if (data.length > 0) res.json({ module: data[0], success: true });
      else res.status(404).json({ error: 'Not found', success: false });
    }
    else res.status(401).send('NOT_AUTHORIZED');
  }
  catch (e) {
    res.status(500).json({ error: e.message, success: false });
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
