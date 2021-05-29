/* next-iron-session est un module qui permet de stocker les données de session en local chez chaque client,
évitant ansi les appels inuties, et on se sert donc des cookies pour sauvegarder les données */
import withSession from "../../../lib/session";

import { query } from '../../../lib/db';
import { verify } from '../../../lib/encryption';

async function handler(req, res) {
  // On vérifie que le corps de la requête contient l'e-mail et le mot de passe, si c'est pas le cas on renvoie une erreur
  if (!req.body.email || !req.body.password) return res.status(400).json({ error: 'MISSING_PARAMETERS', success: false });

  try {
    if (req.session.get('user')) return res.status(400).json({ error: 'ALREADY_AUTHENTIFIED', success: true });

    // On cherche dans la table users tous les utilisateurs ayant l'adresse mail sélectionnée
    const results = await query(`
      SELECT userId, email, hash, userType, firstName, lastName, birthDate, school, degree, year, groupId, groups.name AS groupName, avatar_key, avatar_value, delegate, resourceId FROM users
      LEFT OUTER JOIN groups ON groups.id = users.groupId
      WHERE email = ?`, req.body.email);
    if (results.length > 0) { // Si un utilisateur est trouvé on poursuit
      // On vérifie le mot de passe avec le hash qu'on a dans le tuple sélectionné
      const isPasswordVerified = await verify(req.body.password, results[0].hash);
      // Si ce n'est pas le bon mot de passe, on renvoie une erreur
      if (!isPasswordVerified) return res.status(400).json({ error: 'WRONG_MAIL_OR_PASSWORD', success: false });

      // Sinon, on enregistre l'utilisateur dans le navigateur du client
      req.session.set('user', {
        userId: results[0].userId,
        email: results[0].email,
        firstName: results[0].firstName,
        lastName: results[0].lastName,
        birthDate: results[0].birthDate,
        userType: results[0].userType,
        delegate: results[0].delegate === 1,
        school: results[0].school,
        degree: results[0].degree,
        year: results[0].year,
        group: {
          id: results[0]?.groupId,
          name: results[0]?.groupName
        },
        resourceId: results[0].resourceId,
        avatar: results[0].avatar_key && results[0].avatar_value ? { [results[0].avatar_key]: results[0].avatar_value } : {}
      } /* On sélectionne les variables voulues */);
      await req.session.save();

      res.send({ success: true });

    } // Sinon on renvoie une erreur générale (pour éviter de donner trop d'indices aux truands)
    else return res.status(400).json({ error: 'WRONG_MAIL_OR_PASSWORD', success: false });
  }
  catch (e) {
    res.status(500).json({ error: e.message, success: false });
  }
}

export default withSession(handler);
