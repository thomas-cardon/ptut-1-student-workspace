import React, { useState } from 'react';

import Router from 'next/router';
import Link from '../components/Link';

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
  /*
   * Variable definitions
   */
   let permsDesc;

   const [values, setValues] = useState({ oldPassword: '', newPassword: '' });
   const { addToast } = useToasts();

   const handleInputChange = e => {
     const {name, value, checked, type } = e.target;
     setValues({ ...values, [name]: type === 'checkbox' ? checked : value });
   };

  /*
   * End of variable definitions
   */
   let res;
   const onSubmit = async (e) => {
     e.preventDefault();

     try {
       if (values.oldPassword === values.newPassword) return addToast("❌ ➜  L'ancien mot de passe est le même que le nouveau.", { appearance: 'error' });

       res = await fetch(location.protocol + '//' + location.host + '/api/me', {
         body: JSON.stringify({ oldPassword: values.oldPassword, newPassword: values.newPassword }),
         headers: { 'Content-Type': 'application/json' },
         method: 'PATCH'
       });

       const result = await res.text();
       console.dir(result);

       if (res.ok) {
         addToast('Mot de passe changé', { appearance: 'success' });
         Router.push('/login');
       }
       else {
         addToast('Une erreur s\'est produite', { appearance: 'error' });
       }
     }
     catch(error) {
       console.error(error);

       if (res.status === 401) addToast('Vous ne pouvez pas effectuer cette action.', { appearance: 'error'});
       else addToast('Une erreur s\'est produite', { appearance: 'error' });
     }
  };

  if (user.userType == 0) permsDesc = 'vous disposez des permissions les plus basiques.';
  else if (user.userType == 1) permsDesc = 'vous êtes professeur. Vous pouvez créer des posts, ajouter des devoirs, notifier les élèves, etc.';
  else permsDesc = "vous faites partie de l'administration. Vous avez tous les droits possibles sur le service.";
  return (
    <UserLayout user={user} flex={true}>
      <Title appendGradient={user.firstName}>
        Paramètres utilisateur:
      </Title>
      <Highlight>
        Cliquez&nbsp;<Link href="http://en.gravatar.com/emails/" style={{ color: 'red' }}>ici</Link>&nbsp;pour accéder à&nbsp;<b>Gravatar</b>&nbsp;et ainsi changer votre photo de profil.
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
        <Fields.FormInput label="Ancien mot de passe" id="oldPassword" name="oldPassword" minLength="8" onChange={handleInputChange} value={values.oldPassword} type="password" required />
        <Fields.FormInput label="Nouveau mot de passe" id="newPassword" name="newPassword" minLength="8" onChange={handleInputChange} value={values.newPassword} type="password" required />
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
