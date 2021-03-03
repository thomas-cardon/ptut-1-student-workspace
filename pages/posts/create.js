import React, { useState } from 'react';

import Router from 'next/router';
import dynamic from 'next/dynamic';

import UserLayout from '../../components/UserLayout';
import Highlight from "../../components/Highlight";
import Title from '../../components/Title';

import Form from "../../components/Form";
import * as Fields from "../../components/FormFields";

import { useToasts } from 'react-toast-notifications';

import useSWR from 'swr';
import fetcher from '../../lib/fetchJson';
import withSession from "../../lib/session";

import { formatDistance } from 'date-fns';
import { fr } from 'date-fns/locale';

const Editor = dynamic(() => import("../../components/Editor"), { ssr: false });

export default function CreatePostPage({ user, moduleId }) {
 /*
  * Variable definitions
  */
  const [values, setValues] = useState({ homework: false, title: 'Sans titre', classId: '', courseId: '', homeworkDate: '' });

  const handleInputChange = e => {
    const {name, value, checked, type } = e.target;
    setValues({ ...values, [name]: type === 'checkbox' ? checked : value });
  };

  const { data : classes } = useSWR('/api/class/list', fetcher);
  const { data : scheduleList } = useSWR(`/api/schedule${user.userType == 1 ? '?filterByTeacher=' + user.userId : ''}`, fetcher);

  const { addToast } = useToasts();

 /*
  * End of variable definitions
  */

  let content = <h1 className={'title'}>Chargement...</h1>;

  const onSubmit = async (e) => {
    e.preventDefault();

    let body = {
      title: values.title,
      content: localStorage.getItem('posts.lastSavedState'),
      classId: parseInt(values.classId),
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

  let scheduleSelector = scheduleList && scheduleList.schedule ? (
    <Fields.FormSelect disabled={values.homework == "1"} label="Attacher à l'emploi du temps ?" name="courseId" onChange={handleInputChange} value={values.courseId} noOption="-- Ne pas attacher à l'emploi du temps --" options={scheduleList.schedule.map(x => { return { option: formatDistance(Date.parse(x.start), new Date(), { locale: fr, addSuffix: true }) + (x.groupName ? ' avec: ' + x.groupName : ''), value: x.id } })} />
  ) : (
    <Fields.FormSelect disabled={values.homework == "1"} label="Attacher à l'emploi du temps ?" name="courseId" noOption="-- Aucun cours disponible --" disabled />
  );

  if (user && classes) content = (<>
    <Title appendGradient="nouveau post">
      Edition d'un
    </Title>

    <Highlight title={'Le saviez-vous?'}>Le contenu du post est enregistré sur votre navigateur tant qu'il n'est pas envoyé.</Highlight>
    <Form style={{ width: '60%' }} onSubmit={onSubmit} onError={onError}>
      <Fields.FormInput label="Titre du post" name="title" type="text" onChange={handleInputChange} value={values.title} placeholder="Titre" required />
      <Fields.FormSelect label="Matière (Module)" name="classId" onChange={handleInputChange} noOption="-- Sélectionnez un module --" value={values.classId} options={classes.modules.map(x => { return { option: 'Cours ' + x.module, value: x.id } })} required />
      <Fields.FormCheckbox label="Est-ce un devoir ?" name="homework" inline={true} onChange={handleInputChange} value={values.homework} />
      <Fields.FormInput disabled={values.homework == "0"} label="Date du devoir" name="homeworkDate" type="datetime-local" onChange={handleInputChange} value={values.homeworkDate} />
      {scheduleSelector}
      <Fields.FormButton type="submit">Créer un nouveau post</Fields.FormButton>
    </Form>
    <Editor style={{ width: '60%' }} />
  </>);

  return (
    <UserLayout user={user} flex={true}>
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
