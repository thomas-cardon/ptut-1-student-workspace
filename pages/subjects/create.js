import React, { useState } from 'react';

import { useToasts } from 'react-toast-notifications';
import fetch from 'isomorphic-unfetch';

import withSession from "../../lib/session";
import UserLayout from '../../components/UserLayout';

import Title from '../../components/Title';
import Form from '../../components/Form';
import * as Fields from "../../components/FormFields";

export default function CreateClassPage({ user }) {
  const [color, setColor] = useState(null);
  const { addToast } = useToasts();

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(location.protocol + '//' + location.host + '/api/subjects/' + e.target.moduleId.value, {
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

  return (
    <UserLayout user={user} flex={true} header={<>
      <Title appendGradient="nouveau cours">Edition d'un</Title>
    </>}>
      <Form onSubmit={onSubmit} style={{ width: '80%', padding: '1em', margin: 'auto auto 2em auto', borderRadius: '8px', backgroundColor: 'var(--color-primary-800)' }}>
        <Fields.FormInput label="Module" id="moduleId" name="moduleId" type="text" placeholder="M1101" required />
        <Fields.FormInput label="Nom du cours" id="name" name="name" type="text" placeholder="Introduction aux systèmes en informatique" required />
        <div className="buttons" style={{ marginTop: '1em', justifyContent: 'center' }}>
          <Fields.ColorPickerButton type="submit" handleChange={color => setColor(useState)}>Choisir la couleur</Fields.ColorPickerButton>
          <Fields.FormButton type="submit" is="danger">Créer</Fields.FormButton>
        </div>
      </Form>
    </UserLayout>
  );
};

export const getServerSideProps = withSession(async function ({ req, res, query, params }) {
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
