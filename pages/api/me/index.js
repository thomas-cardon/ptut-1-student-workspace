import withSession from "../../../lib/session";

function handler(req, res) {
  if (!req?.session?.get('user')) return res.status(401).send({ error: 'NOT_AUTHORIZED', success: false });
  res.send(req.session.get('user'));
}

export default withSession(handler);
