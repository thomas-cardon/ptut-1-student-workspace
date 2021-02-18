import useUser from '../../lib/useUser';
import useServiceWorker from '../../lib/workers';

import { useToasts } from 'react-toast-notifications';

import React, { useState } from 'react';
import { SketchPicker } from 'react-color';


import UserLayout from '../../components/UserLayout';

import useSWR from 'swr';
import fetch from 'isomorphic-unfetch';
const fetcher = url => fetch(url).then(r => r.json());

import Form from "../../components/Form";
import * as Fields from "../../components/FormFields";

function Page({ moduleId }) {
  useServiceWorker();

  const [color, setColor] = useState('#AB2567');

  const { user } = useUser({ redirectNotAuthorized: '/login', redirectOnError: '/error' }); /* Redirection si l'utilisateur n'est pas connecté */
  const { addToast } = useToasts();

  let content = <h1 className={'title'}>Chargement...</h1>;

  console.log(color);

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(location.protocol + '//' + location.host + '/api/class/' + e.target.moduleId.value, {
        body: JSON.stringify({
          name: e.target.name.value,
          color: color.slice(1)
        }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST'
      });

      const result = await res.json();
      console.dir(result);

      if (result.success) {
        addToast('Cours ajouté avec succès', { appearance: 'success' });
        e.target.reset();
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

  if (user) content = (<>
    <h1 className={'title'}>
      Edition d'un <span style={{ color: '#D56A53' }}>nouveau cours</span>
    </h1>

    <div style={{ display: 'flex', flexDirection: 'row', marginTop: '5em' }}>
      <SketchPicker color={color} onChangeComplete={color => setColor(color.hex)} />

      <Form onSubmit={onSubmit} onError={onError}>
        <Fields.FormInput label="Module" id="moduleId" name="moduleId" type="text" placeholder="M1101" required />
        <Fields.FormInput label="Nom du cours" id="name" name="name" type="text" placeholder="Introduction aux systèmes en informatique" required />
        <Fields.FormButton type="submit">Créer</Fields.FormButton>
      </Form>
    </div>
  </>);

  return (
    <UserLayout user={user} flex={true}>
      {content}
    </UserLayout>
  );
};

export function getServerSideProps(ctx) {
  return { props: ctx.query };
}

export default Page;
