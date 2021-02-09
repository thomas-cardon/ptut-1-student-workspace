/* next-iron-session est un module qui permet de stocker les données de session en local chez chaque client,
évitant ansi les appels inuties, et on se sert donc des cookies pour sauvegarder les données */
import { withIronSession } from "next-iron-session";

async function handler(req, res) {
  req.session.set('user', {
    id: 1,
    firstName: 'Thomas',
    lastName: 'Cardon',
    userType: 2 /* 0 = user, 1 = teacher, 2 = admin */
  });

  await req.session.save();
  res.send('ok');
}

export default withIronSession(handler, {
  cookieName: "ptut-1/sessions/v1",
  password: process.env.SECRET_COOKIE_PASSWORD,
  // La sécurisation s'active que si Node.js n'est pas en mode développement (il est en production quand c'est Vercel qui l'héberge)
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
});
