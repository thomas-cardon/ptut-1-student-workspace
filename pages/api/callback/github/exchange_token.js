import withSession from '../../../../lib/session';
import fetch from 'isomorphic-unfetch';

async function handler(req, res) {
  if (!req?.session?.get('user')) return res.status(401).send({ error: 'NOT_AUTHORIZED', success: false });
  if (!req.query.code) return res.status(404).send({ error: 'CODE_NOT_FOUND', success: false });

  try {
    const response = await fetch(`https://github.com/login/oauth/access_token?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_SECRET}&code=${req.query.code}&redirect_uri=${process.env.NEXT_PUBLIC_URL_PREFIX + '/api/callback/github/avatar'}`);
    const query = await response.text();

    const token = query.slice(13, -25);

    res.redirect('/api/callback/github/avatar?token=' + token);
  }
  catch(error) {
    console.error(error);
    res.send(error);
  }
}

export default withSession(handler);
