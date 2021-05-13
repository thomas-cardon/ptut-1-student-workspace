import withSession from '../../../../lib/session';
import { query } from '../../../../lib/db';

import fetch from 'isomorphic-unfetch';

async function handler(req, res) {
  if (!req?.session?.get('user')) return res.status(401).send({ error: 'NOT_AUTHORIZED', success: false });

  try {
    const githubUser = await fetch('https://api.github.com/user', { headers: { Authorization: 'token ' + req.query.token } });
    const user = await githubUser.json(); // .login

    await query(`
      UPDATE users
      SET avatar_key = ?, avatar_value = ?
      WHERE userId = ?`
    , ['githubHandle', user.login, req.session.get('user').userId]);

    res.redirect('/logout');
  }
  catch (e) {
    res.status(500).json({ error: e.message, success: false });
  }
}

export default withSession(handler);
