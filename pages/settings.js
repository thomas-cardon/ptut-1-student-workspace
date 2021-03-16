import Link from 'next/link';
import Image from 'next/image';

import Gravatar from 'react-gravatar';

import withSession from "../lib/session";
import { useAvatar } from '../lib/hooks';

import UserLayout from '../components/UserLayout';
import Title from '../components/Title';

import Form from "../components/Form";
import * as Fields from "../components/FormFields";

import Highlight from '../components/Highlight';

import { useToasts } from 'react-toast-notifications';

export default function SettingsPage({ user }) {
  const { addToast } = useToasts();

  let permsDesc;
  const onSubmit = async (e) => {};
  const onAvatarChange = async (e) => {
    addToast('Changement en cours', { appearance: 'info' });
    let avatar = await encodeImageAsBase64(e);

    try {
      const res = await fetch(location.protocol + '//' + location.host + '/api/me/avatar', {
        body: JSON.stringify({ avatar }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST'
      });

      const result = await res.json();
      console.dir(result);

      if (result.success) addToast('Avatar changé', { appearance: 'success' });
      else addToast(result.error || 'Une erreur s\'est produite', { appearance: 'error' });
    }
    catch(error) {
      console.error(error);
      addToast(error || 'Une erreur s\'est produite', { appearance: 'error' });
    }
  };

  const encodeImageAsBase64 = e => {
    return new Promise((resolve, reject) => {
      let file = e.target.files[0];

      let reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  }

  if (user.userType == 0) permsDesc = 'vous disposez des permissions les plus basiques.';
  else if (user.userType == 1) permsDesc = 'vous êtes professeur. Vous pouvez créer des posts, ajouter des devoirs, notifier les élèves, etc.';
  else permsDesc = "vous faites partie de l'administration. Vous avez tous les droits possibles sur le service.";
  return (
    <UserLayout user={user} flex={true}>
      <Title appendGradient={user.firstName}>
        Paramètres utilisateur:
      </Title>
      <Highlight>
        Cliquez&nbsp;<Link href="http://en.gravatar.com/emails/"><a>ici</a></Link>&nbsp;pour accéder à&nbsp;<b>Gravatar</b>&nbsp;et ainsi changer votre photo de profil.
      </Highlight>
      <Gravatar size={128} email={user.email} style={{ borderRadius: '50%', margin: '0.5em' }} draggable={false} />
      <h3 style={{ fontSize: 'xx-large', fontWeight: 'normal', margin: '0 0 1em 0' }}>
        {user.firstName} <b style={{ color: '#686de0' }}>{user.lastName}</b>
      </h3>
      <p style={{ width: '50%', textAlign: 'center' }}>
        <i>Vous êtes un utilisateur de type {user.userType}, c'est-à-dire que {permsDesc}</i>
      </p>

      <h2>Changer son mot de passe</h2>
      <hr style={{ width: '60%' }} />
      <Form onSubmit={onSubmit}>
        <Fields.FormInput label="Ancien mot de passe" id="oldPassword" name="oldPassword" type="password" disabled={true} />
        <Fields.FormInput label="Nouveau mot de passe" id="newPassword" name="newPassword" type="password" disabled={true} />
        <Fields.FormButton type="submit" disabled={true}>Changer</Fields.FormButton>
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
