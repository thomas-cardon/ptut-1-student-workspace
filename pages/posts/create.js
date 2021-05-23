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

export default function CreatePostPage() {
 /*
 * Variable definitions
 */
  const { user } = useUser({ redirectTo: '/login', perms: [{ userType: 1 }, { delegate: true }] });
  const [values, setValues] = useState({ title: 'Sans titre', subjectId: '', groupId: null });

  const { data : subjects } = useSubjects();
  const { data : groups } = useGroups();

  const { addToast } = useToasts();

  const handleInputChange = e => {
    const {name, value, checked, type } = e.target;

    if (type === 'radio') setValues({ ...values, [name]: e.target.id });
    else setValues({ ...values, [name]: type === 'checkbox' ? checked : value });
  };

  /*
  * End of variable definitions
  */

  const onSubmit = async (e) => {
    e.preventDefault();

    let body = {
      title: values.title,
      content: localStorage.getItem('posts.lastSavedState'),
      groupId: parseInt(values.groupId),
      subjectId: parseInt(values.subjectId),
    };

    if (!body.content) return addToast('Erreur: contenu manquant', { appearance: 'error' });

    try {
      const res = await fetch(location.protocol + '//' + location.host + '/api/posts/create', {
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST'
      });

      const result = await res.json();
      console.dir(result);

      if (result.success) {
        addToast('Post envoyé avec succès', { appearance: 'success' });

        localStorage.removeItem('posts.lastSavedState', null);
        Router.push('/posts');
      }
      else addToast(result.error || 'Une erreur s\'est produite', { appearance: 'error' });
    }
    catch(error) {
      console.error(error);
      addToast(error || 'Une erreur s\'est produite', { appearance: 'error' });
    }
  }

  return (
    <UserLayout user={user} title="Création de posts" flex={true}>
      <style jsx global>{`
        body::selection {
          background-color: rebeccapurple !important;
        }

        form > button {
          width: 100%;
          margin-top: 1em;
        }
        `}</style>
        <Title appendGradient="post">
          Edition d'un
        </Title>

        <Highlight title={'Le saviez-vous?'}>Le contenu du post est enregistré sur votre navigateur tant qu'il n'est pas envoyé.</Highlight>

        {user && subjects ? (
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', columnGap: '20px' }}>
            <Form onSubmit={onSubmit} style={{ flex: '1', padding: '1em', margin: '0 auto', borderRadius: '8px', backgroundColor: 'var(--color-primary-800)' }}>
              <Fields.FormInput label="Titre du post" name="title" type="text" onChange={handleInputChange} value={values.title} placeholder="Titre" required />
              <Fields.FormSelect label="Matière (Module)" name="subjectId" disabled={user.userType === 0} onChange={handleInputChange} noOption="-- Sélectionnez un module --" value={values.subjectId} options={(subjects || []).map(x => { return { option: x.module + ' | ' + x.name, value: x.id } })} />

              <label style={{ marginRight: '1em', fontWeight: 'bolder', color: 'white' }}>Ou, un groupe sélectionné</label>
              {groups && groups.map(x => <Fields.FormRadio id={x.id} name="groupId" onChange={handleInputChange}>{x.name}</Fields.FormRadio>)}

              <Fields.FormButton type="submit" is="danger">Créer un nouveau post</Fields.FormButton>
            </Form>

            <div style={{ flex: '1', padding: '1em', borderRadius: '8px', backgroundColor: 'var(--color-primary-700)', color: 'white' }}>
              <Editor style={{ width: '100%', boxShadow: 'none' }} />
            </div>
          </div>
        ) : <Loader type="Oval" color="var(--color-accent)" height="5em" width="100%" />}
    </UserLayout>
  );
};
