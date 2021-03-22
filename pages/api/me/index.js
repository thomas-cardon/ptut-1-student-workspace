import withSession from "../../../lib/session";

import { query } from '../../../lib/db';
import { hash, verify } from '../../../lib/encryption';

async function handler(req, res) {
  const user = req?.session?.get('user');
  
  if (req.method === 'PATCH') { // Modification
    if (!user) return res.status(401).send({ error: 'NOT_AUTHORIZED', success: false });
    if (!req.body.oldPassword || !req.body.newPassword) return res.status(400).json({ error: 'MISSING_PARAMETERS', success: false });

    try {
      let u = await query(`
        SELECT hash
        FROM users
        WHERE userId = ?`, [user.userId]);

      if (u.length === 0) return res.status(404).send({ error: 'USER_NOT_EXISTS', success: false });

      const isPasswordVerified = await verify(req.body.oldPassword, u[0].hash);
      if (!isPasswordVerified) return res.status(400).json({ error: "Vous n'avez pas entré le bon mot de passe.", success: false });

      if (await verify(req.body.newPassword, u[0].hash))
      return res.status(400).json({ error: "Vous ne pouvez pas redéfinir le même mot de passe.", success: false });

      const results = await query(`
        UPDATE users
        SET hash = ?
        WHERE userId = ?`, [await hash(req.body.newPassword), user.userId]);

      await req.session.destroy();

      res.writeHead(301, {
        'cache-control': 'no-store, max-age=0',
        Location: '/login',
        'Content-Length': Buffer.byteLength('ok'),
        'Content-Type': 'text/plain'
      }).end('ok');
    }
    catch(error) {
      res.status(500).send({ error: error.message, success: false });
    }
  }
  else {
    if (!user) return res.status(401).send({ error: 'NOT_AUTHORIZED', success: false });
    res.send(user);
  }
}

export default withSession(handler);
