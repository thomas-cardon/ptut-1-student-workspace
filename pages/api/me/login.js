/* next-iron-session est un module qui permet de stocker les données de session en local chez chaque client,
évitant ansi les appels inuties, et on se sert donc des cookies pour sauvegarder les données */
import { withIronSession } from "next-iron-session";
import { query } from '../../../lib/db';
import { verify } from '../../../lib/encryption';

//
async function handler(req, res) {
  // On vérifie que le corps de la requête contient l'e-mail et le mot de passe, si c'est pas le cas on renvoie une erreur
  if (!req.body.email || !req.body.password) return res.status(400).json({ error: 'MISSING_PARAMETERS' });
  if (req.session) return res.status(400).json({ error: 'ALREADY_AUTHENTIFIED' });
  
  try {
    // On cherche dans la table users tous les utilisateurs ayant l'adresse mail sélectionnée
    const results = await query('SELECT `id`, `firstName`, `lastName`, `birthDate`, `userType`, `hash` FROM `users` WHERE `email` = ?', req.body.email);
    if (results.length > 0) { // Si un utilisateur est trouvé on poursuit
      // On vérifie le mot de passe avec le hash qu'on a dans le tuple sélectionné
      const isPasswordVerified = await verify(req.body.password, results[0].hash);
      // Si ce n'est pas le bon mot de passe, on renvoie une erreur
      if (!isPasswordVerified) return res.status(400).json({ error: 'WRONG_MAIL_OR_PASSWORD' });

      // Sinon, on enregistre l'utilisateur dans le navigateur du client
      req.session.set('user', results[0]);
      await req.session.save();

      res.send('ok');

    } // Sinon on renvoie une erreur générale (pour éviter de donner trop d'indices aux truands)
    else return res.status(400).json({ error: 'WRONG_MAIL_OR_PASSWORD' });
  }
  catch (e) {
    res.status(500).json({ message: e.message });
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
