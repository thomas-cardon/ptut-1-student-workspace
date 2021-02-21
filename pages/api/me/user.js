import withSession from "../../../lib/session";

function handler(req, res) {
  if (!req.session) return res.status(401).send({ error: 'NOT_AUTHORIZED', success: false });

  const user = req.session.get('user');
  if (!user) return res.status(401).send({ error: 'NOT_AUTHORIZED', success: false });

  res.send(user);
}

export default withSession(handler);
