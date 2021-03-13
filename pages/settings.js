import Link from 'next/link';

import withSession from "../lib/session";
import { getAvatar } from '../lib/useUser';

import UserLayout from '../components/UserLayout';
import Title from '../components/Title';

import Form from "../components/Form";
import * as Fields from "../components/FormFields";

export default function SettingsPage({ user }) {
  let permsDesc;
  const onSubmit = async (e) => {};

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

      <h2>Changer son mot de passe</h2>
      <hr style={{ width: '60%' }} />
      <Form onSubmit={onSubmit}>
        <Fields.FormInput label="Ancien mot de passe" id="oldPassword" name="oldPassword" type="password" required />
        <Fields.FormInput label="Nouveau mot de passe" id="newPassword" name="newPassword" type="password" required />
        <Fields.FormButton type="submit">Changer</Fields.FormButton>
      </Form>
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
