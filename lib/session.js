import { withIronSession } from "next-iron-session";

export default function withSession(handler) {
  return withIronSession(handler, {
    cookieName: "ptut-1/sessions/v2",
    password: process.env.SECRET_COOKIE_PASSWORD,
    // La sécurisation s'active que si Node.js n'est pas en mode développement (il est en production quand c'est Vercel qui l'héberge)
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  });
}
