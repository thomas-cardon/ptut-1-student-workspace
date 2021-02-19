import BasicLayout from '../components/BasicLayout';

import { useToasts } from 'react-toast-notifications';

import useSWR from 'swr';
import { useUser } from '../lib/useUser';

import Router from 'next/router';

import fetch from 'isomorphic-unfetch';
const fetcher = url => fetch(url).then(r => r.json());

import Form from "../components/Form";
import * as Fields from "../components/FormFields";

export default function Login(props) {
  const { user } = useUser({ redirectTo: '/dashboard' }); /* Redirection si l'utilisateur est connecté */
  const { addToast } = useToasts();

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(location.protocol + '//' + location.host + '/api/me/login', {
        body: JSON.stringify({
          email: e.target.email.value,
          password: e.target.password.value
        }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST'
      });

      const result = await res.json();
      console.dir(result);

      if (result.success) {
        addToast('Connexion réussie', { appearance: 'success' });
        Router.push('/dashboard');
      }
      else addToast(result.error || 'Une erreur s\'est produite', { appearance: 'error' });
    }
    catch(error) {
      console.error(error);
      addToast(error || 'Une erreur s\'est produite', { appearance: 'error' });
    }
  }

  const onError = (errors, e) => {
    console.error(errors, e);
    addToast(errors || 'Une erreur s\'est produite', { appearance: 'error' });
  }

  return (
    <BasicLayout title="Connexion">
      <h1 className={'title gradient'}>Connectez-vous</h1>
      <h2 className={'title'}>...pour accéder au tableau de bord</h2>
      <Form onSubmit={onSubmit} onError={onError}>
        <Fields.FormInput label="Adresse mail" id="email" name="email" type="email" placeholder="exemple@exemple.fr" />
        <Fields.FormInput label="Mot de passe" id="password" name="password" type="password" placeholder="Mot de passe difficile à trouver" />
        <Fields.FormButton id="forgotPassword" type="button">Mot de passe oublié?</Fields.FormButton>
        <Fields.FormButton type="submit">Se connecter</Fields.FormButton>
      </Form>
    </BasicLayout>
  );
};
