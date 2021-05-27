import React, { useState, useEffect } from 'react';

import { useToasts } from 'react-toast-notifications';
import Loader from 'react-loader-spinner';

import Router from 'next/router';
import dynamic from 'next/dynamic';

import { formatDistance } from 'date-fns';
import { fr } from 'date-fns/locale';

import UserLayout from '../../components/UserLayout';
import Highlight from "../../components/Highlight";
import Title from '../../components/Title';

import Form from "../../components/Form";
import * as Fields from "../../components/FormFields";

const Editor = dynamic(() => import("../../components/Editor"), { ssr: false });

import useUser from '../../lib/useUser';
import { useSubjects, useGroups } from '../../lib/hooks';

export default function CreateHomeworkPage() {
 /*
 * Variable definitions
 */
  const id = 5;
  
  const { user } = useUser({ redirectTo: '/login', perms: [{ userType: 1 }, { delegate: true }] });
  const [values, setValues] = useState({ date: '', content: '', subjectId: '', groupId: '' });
  const { data : subjects } = useSubjects();
  const { data : groups } = useGroups();

  const { addToast } = useToasts();

  const handleInputChange = e => {
    const {name, value, checked, type } = e.target;

    if (type === 'radio') setValues({ ...values, [name]: isNaN(e.target.id) ? e.target.id : parseInt(e.target.id) });
    else setValues({ ...values, [name]: type === 'checkbox' ? checked : value });
  };


  /*
 * End of variable definitions
  */

  const onSubmit = async (e) => {
    e.preventDefault();

    let body = {
      content: values.content,
      date: values.date ? values.date.slice(0, 19).replace('T', ' ') : undefined,
      subjectId: parseInt(values.subjectId),
      groupId: values.groupId ? parseInt(values.groupId) : undefined,
    };

    if (!body.content) return addToast('Erreur: contenu manquant', { appearance: 'error' });

    try {
      const res = await fetch(location.protocol + '//' + location.host + '/api/homework/edit', {
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST'
      });

      const result = await res.json();
      console.dir(result);

      if (result.success) {
        addToast('Travail modifié avec succès', { appearance: 'success' });
        Router.push('/dashboard');
      }
      else addToast(result.error || 'Une erreur s\'est produite', { appearance: 'error' });
    }
    catch(error) {
      console.error(error);
      addToast(error || 'Une erreur s\'est produite', { appearance: 'error' });
    }
  }

  return (
    <UserLayout user={user} title="Modifier un devoir" flex={true}>
      <Title appendGradient={"#" + id}>
        Modification du devoir
      </Title>

      {user && subjects ? (
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', columnGap: '20px' }}>
          <Form onSubmit={onSubmit} style={{ flex: '1', padding: '1em', margin: '0 auto', borderRadius: '8px', backgroundColor: 'var(--color-primary-800)' }}>
            <Fields.FormInput label="Description" name="content" type="text" onChange={handleInputChange} value={values.content} placeholder="Finir l'exercice 1..." required />
            <Fields.FormSelect label="Matière (Module)" name="subjectId" onChange={handleInputChange} noOption="-- Sélectionnez un module --" value={values.subjectId} options={(subjects || []).map(x => { return { option: x.module + ' ' + x.name, value: x.id } })} required />
            <Fields.FormInput label="A faire pour le" name="date" type="date" min={new Date().toISOString().split("T")[0]} onChange={handleInputChange} value={values.date} required/>

            {user.userType > 0 && groups && groups.map(x => <>
              <Fields.FormRadio id={x.id} name="groupId" onChange={handleInputChange}>{x.name}</Fields.FormRadio>
            </>)}

            <Fields.FormButton type="submit">Ajouter le travail</Fields.FormButton>
          </Form>
        </div>
      ) : <Loader type="Oval" color="var(--color-accent)" height="5em" width="100%" />}
    </UserLayout>
  );
};
