import React, { useState } from 'react';

import Router from 'next/router';
import Link from '../components/Link';

import Gravatar from 'react-gravatar';

import UserLayout from '../components/UserLayout';
import Title from '../components/Title';

import Form from "../components/Form";
import * as Fields from "../components/FormFields";

import Highlight from '../components/Highlight';

import Loader from 'react-loader-spinner';

import useUser from '../lib/useUser';
import { useToasts } from 'react-toast-notifications';

export default function SettingsPage() {
  /*
   * Variable definitions
   */
   const { user } = useUser({ redirectTo: '/login' });

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

       if (res.ok) {
         addToast('Mot de passe changé', { appearance: 'success' });
         Router.push('/login');
       }
       else addToast('Une erreur s\'est produite', { appearance: 'error' });
     }
     catch(error) {
       console.error(error);

       if (res.status === 401) addToast('Vous ne pouvez pas effectuer cette action.', { appearance: 'error'});
       else addToast('Une erreur s\'est produite', { appearance: 'error' });
     }
  };

  let content = <Loader type="Oval" color="var(--color-accent)" height="5em" width="100%" />;

  if (user?.isLoggedIn) {
    content = (<>
      <div className="content">
        <div style={{ width: '89%', borderRadius: '8px', backgroundColor: 'var(--color-primary-800)', padding: '1em', margin: 'auto auto 2em' }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Link href="http://en.gravatar.com/emails/" style={{ color: 'red' }}>
              <Gravatar size={128} email={user.email} style={{ borderRadius: '50%', margin: '0 .5em .5em 0' }} draggable={false} />
            </Link>
            <h3 style={{ fontSize: 'xx-large', fontWeight: 'normal', margin: '0 0 1em 0' }}>
              {user.firstName} <b style={{ color: '#686de0' }}>{user.lastName}</b>
            </h3>
          </div>
          <p className="subtitle">
            <i>
              Vous êtes un utilisateur de type {user.userType}, c'est-à-dire que
              {user.userType == 0 ? 'vous disposez des permissions les plus basiques.'
                                  : (user.userType == 1 ? 'vous êtes professeur. Vous pouvez créer des posts, ajouter des devoirs, notifier les élèves, etc.'
                                                        : "vous faites partie de l'administration. Vous avez tous les droits possibles sur le service.")
              }</i>
          </p>
        </div>
      </div>

      <Form onSubmit={onSubmit} style={{ width: '89%', borderRadius: '8px', backgroundColor: 'var(--color-primary-800)', padding: '1em', margin: 'auto auto 2em' }}>
        <h2>Changer son mot de passe</h2>
        <hr style={{ marginBottom: '1em', marginTop: '-0.5em' }} />
        <Fields.FormInput label="Ancien mot de passe" id="oldPassword" name="oldPassword" minLength="8" onChange={handleInputChange} value={values.oldPassword} type="password" required />
        <Fields.FormInput label="Nouveau mot de passe" id="newPassword" name="newPassword" minLength="8" onChange={handleInputChange} value={values.newPassword} type="password" required />
        <Fields.FormButton type="submit">Changer</Fields.FormButton>
      </Form>
    </>);
  }

  return (
    <UserLayout user={user} flex={true} header={
      <Title appendGradient="utilisateur" style={{ textAlign: 'center' }}>
        Paramètres
      </Title>
    }>
      <Highlight style={{ width: '89%', margin: '1em auto 2em auto' }}>
        Cliquez&nbsp;<Link href="http://en.gravatar.com/emails/" style={{ color: 'red' }}>ici</Link>&nbsp;pour accéder à&nbsp;<b>Gravatar</b>&nbsp;et ainsi changer votre photo de profil.
      </Highlight>

      {content}

      <style jsx global>{`
      .content {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      `}</style>
    </UserLayout>
  );
};
