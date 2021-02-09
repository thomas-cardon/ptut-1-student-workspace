import { withIronSession } from "next-iron-session";

function handler(req, res, session) {
  if (!req.session) return res.status(401).send('NOT_AUTHORIZED');

  const user = req.session.get('user');
  if (!user) return res.status(401).send('NOT_AUTHORIZED');

  res.send({ user });
}

export default withIronSession(handler, {
  cookieName: "ptut-1/sessions/v1",
  password: process.env.SECRET_COOKIE_PASSWORD,
  // La sécurisation s'active que si Node.js n'est pas en mode développement (il est en production quand c'est Vercel qui l'héberge)
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
});
