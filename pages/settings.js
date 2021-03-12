import Link from 'next/link';

import withSession from "../lib/session";
import { getAvatar } from '../lib/useUser';

import UserLayout from '../components/UserLayout';
import Title from '../components/Title';

export default function SettingsPage({ user }) {
  let permsDesc;

  if (user.userType == 0) permsDesc = 'vous disposez des permissions les plus basiques.';
  else if (user.userType == 1) permsDesc = 'vous êtes professeur. Vous pouvez créer des posts, ajouter des devoirs, notifier les élèves, etc.';
  else permsDesc = "vous faites partie de l'administration. Vous avez tous les droits possibles sur le service.";
  return (
    <UserLayout user={user} flex={true}>
      <Title appendGradient={user.firstName}>
        Paramètres utilisateur:
      </Title>
      <img style={{ borderRadius: '50%', width: '10%', margin: '2em' }} src={getAvatar(user)} />
      <code>
        NOM: {user.firstName} {user.lastName}
      </code>
      <p style={{ width: '50%', textAlign: 'center' }}>
        <i>Vous êtes un utilisateur de type {user.userType}, c'est-à-dire que {permsDesc}</i>
      </p>
      <Link href="">
        <a>Mot de passe oublié ?</a>
      </Link>
    </UserLayout>
  );
};

export const getServerSideProps = withSession(async function ({ req, res }) {
  const user = req.session.get('user');

  if (!user) {
    res.setHeader('location', '/login');
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }

  return {
    props: { user: req.session.get('user') },
  };
});
