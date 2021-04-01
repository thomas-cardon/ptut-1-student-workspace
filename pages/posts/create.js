import React, { useState } from 'react';

import Router from 'next/router';
import dynamic from 'next/dynamic';

import UserLayout from '../../components/UserLayout';
import Highlight from "../../components/Highlight";
import Title from '../../components/Title';

import Form from "../../components/Form";
import * as Fields from "../../components/FormFields";

import { useToasts } from 'react-toast-notifications';

import { useSubjects, useSchedule } from '../../lib/hooks';

import { formatDistance } from 'date-fns';
import { fr } from 'date-fns/locale';

import withSession from "../../lib/session";

const Editor = dynamic(() => import("../../components/Editor"), { ssr: false });

import Loader from 'react-loader-spinner';

export default function CreatePostPage({ user }) {
 /*
  * Variable definitions
  */
  let content = <Loader type="Oval" color="var(--color-accent)" height="5em" width="100%" />;;

  const [values, setValues] = useState({ homework: false, title: 'Sans titre', subjectId: '', courseId: '', homeworkDate: '' });

  const handleInputChange = e => {
    const {name, value, checked, type } = e.target;
    setValues({ ...values, [name]: type === 'checkbox' ? checked : value });
  };

  const { data : subjects } = useSubjects();
  const { data : schedule } = useSchedule(user, 1, user.userType === 1 ? user.userId : 0);

  const { addToast } = useToasts();

 /*
  * End of variable definitions
  */

  const onSubmit = async (e) => {
    e.preventDefault();

    let body = {
      title: values.title,
      content: localStorage.getItem('posts.lastSavedState'),
      subjectId: parseInt(values.subjectId),
      courseId: values.courseId ? parseInt(values.courseId) : undefined,
      isHomework: values.homework ? 1 : 0,
      homeworkDate: values.homework ? values.homeworkDate.slice(0, 19).replace('T', ' ') : undefined
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
        Router.push('/posts/list');
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

  let scheduleSelector = schedule ? (<>
    <Fields.FormSelect disabled={values.homework == "1"} label="Attacher à l'emploi du temps ?" name="courseId" onChange={handleInputChange} value={values.courseId} noOption="-- Ne pas attacher à l'emploi du temps --" options={(schedule || []).map(x => { return { option: formatDistance(Date.parse(x.start), new Date(), { locale: fr, addSuffix: true }) + (x.groupName ? ' avec: ' + x.groupName : ''), value: x.id } })} />
    <p>
      <i>Il se peut que vous n'ayez pas de cours disponible si vous n'avez pas de cours de programmé dans l'emploi du temps.</i>
    </p>
  </>) : (<>
    <Fields.FormSelect disabled={values.homework == "1"} label="Attacher à l'emploi du temps ?" name="courseId" noOption="-- Aucun cours disponible --" disabled />
    <p>
      <i>Il se peut que vous n'ayez pas de cours disponible si vous n'avez pas de cours de programmé dans l'emploi du temps.</i>
    </p>
  </>);

  if (user && subjects) content = (<>
    <Title appendGradient="nouveau post">
      Edition d'un
    </Title>

    <Highlight title={'Le saviez-vous?'}>Le contenu du post est enregistré sur votre navigateur tant qu'il n'est pas envoyé.</Highlight>

    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', columnGap: '20px' }}>
      <Form onSubmit={onSubmit} style={{ flex: '1', padding: '1em', margin: '0 auto', borderRadius: '8px', backgroundColor: 'var(--color-primary-800)' }}>
        <Fields.FormInput label="Titre du post" name="title" type="text" onChange={handleInputChange} value={values.title} placeholder="Titre" required />
        <Fields.FormSelect label="Matière (Module)" name="subjectId" onChange={handleInputChange} noOption="-- Sélectionnez un module --" value={values.subjectId} options={(subjects || []).map(x => { return { option: 'Cours ' + x.module, value: x.id } })} required />
        <Fields.FormCheckbox label="Est-ce un devoir ?" name="homework" inline={true} onChange={handleInputChange} value={values.homework} />
        <Fields.FormInput disabled={values.homework == "0"} label="Date du devoir" name="homeworkDate" type="datetime-local" onChange={handleInputChange} value={values.homeworkDate} />
        {scheduleSelector}

        <Fields.FormButton type="submit">Créer un nouveau post</Fields.FormButton>
      </Form>

      <div style={{ flex: '1', padding: '1em', borderRadius: '8px', backgroundColor: 'var(--color-primary-700)', color: 'white' }}>
        <Editor style={{ width: '100%', boxShadow: 'none' }} />
      </div>

      <Fields.FormButton is="danger" style={{ flex: '1 1 100%', margin: '2em 0' }}>Créer un nouveau post</Fields.FormButton>
    </div>
  </>);

  return (
    <UserLayout user={user} flex={true}>
      <style jsx global>{`
        body::selection {
          background-color: rebeccapurple !important;
        }
        `}</style>

      {content}
    </UserLayout>
  );
};

export const getServerSideProps = withSession(async function ({ req, res }) {
  const user = req.session.get('user');

  if (!user || user.userType !== 2) {
    res.setHeader('location', '/login');
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }

  return {
    props: { user: req.session.get('user') },
  };
});
