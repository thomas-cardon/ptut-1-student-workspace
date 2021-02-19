import useSWR from 'swr';
import useUser from '../../lib/useUser';

import UserLayout from '../../components/UserLayout';
import GroupList from '../../components/GroupList';

import Schedule from '../../components/Schedule';

import Form from "../../components/Form";
import * as Fields from "../../components/FormFields";

import { format, formatDistance, formatRelative, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';

import React, { useRef } from 'react';

export default function Page({ props }) {
  const { user } = useUser({ redirectNotAuthorized: '/login', redirectOnError: '/error' }); /* Redirection si l'utilisateur n'est pas connecté */

  const onChange = async (e) => {
    console.log('change');
  };
  
  const onError = (errors, e) => {
    console.error(errors, e);
    addToast(errors || 'Une erreur s\'est produite', { appearance: 'error' });
  };

  let content;

  if (!user) content = <h2 className={'title'}>Chargement</h2>;
  else content = (
    <div style={{ display: 'flex' }}>
      <Form onChange={onChange} onError={onError}>
        <Fields.FormInput label="Début du cours" id="start" name="start" type="datetime-local" required />
        <Fields.FormInput label="Fin du cours" id="end" name="end" type="datetime-local" required />
        <legend style={{ backgroundColor: '#000', color: '#fff', padding: '2px 3px', margin: '1em 0 1em 0' }}>{}</legend>
        <Fields.FormSelect label="Cours" id="classId" name="classId" options={[].map(x => { return { option: 'Cours ' + x.module, value: x.id } })} />
        <Fields.FormButton type="submit">Créer un nouveau post</Fields.FormButton>
      </Form>
    </div>);

  return (
    <UserLayout user={user} flex={true}>
      <h1 className={'title'}>
        Modification de l'emploi du temps
      </h1>
      <div className={'grid'} style={{ width: '98%', margin: '0' }}>
        {content}
      </div>
    </UserLayout>
  );
};
