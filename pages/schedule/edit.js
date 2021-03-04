import React, { useState, useRef } from 'react';
import Router from 'next/router';

import UserLayout from '../../components/UserLayout';
import Title from '../../components/Title';

import Form from "../../components/Form";
import * as Fields from "../../components/FormFields";

import { useToasts } from 'react-toast-notifications';

import use from '../../lib/use';
import withSession from "../../lib/session";

import { formatDuration, differenceInMinutes, isSameDay, getDay } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function EditSchedulePage({ user }) {
  /*
   * Variable definitions
   */
   const [values, setValues] = useState({ start: '', duration: '', classId: '', teacherId: '', meetingUrl: '' });
   const legend = useRef(null);

   const handleInputChange = e => {
     const {name, value, checked, type } = e.target;
     setValues({ ...values, [name]: type === 'checkbox' ? checked : value });
   };

   const { data : modules } = use({ url: '/api/class/list' });
   const { data : groups } = use({ url: '/api/groups/list' });
   const { data : teachers } = use({ url: '/api/users/list?queryUserType=1' });

   const { addToast } = useToasts();

  /*
   * End of variable definitions
   */

  const onSubmit = async (e) => {
    e.preventDefault();

    let body = {
      start: values.start.slice(0, 19).replace('T', ' '),
      duration: differenceInMinutes(new Date(values.end.slice(0, 19).replace('T', ' ')), new Date(values.start.slice(0, 19).replace('T', ' '))),
      classId: parseInt(values.classId),
      teacherId: parseInt(values.teacherId),
      meetingUrl: values.meetingUrl,
      concernedGroups: Array.from(e.target.childNodes[7].querySelectorAll('*')).filter(x => x.nodeName === "INPUT" && x.checked).map(x => { return parseInt(x.getAttribute('data-id')); })
    };

    if (!verify(body)) return;

    try {
      const res = await fetch(location.protocol + '//' + location.host + '/api/posts/create', {
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST'
      });

      const result = await res.json();
      console.dir(result);

      if (result.success) {
        addToast('Cours ajouté à l\'emploi du temps avec succès', { appearance: 'success' });
        Router.push('/schedule');
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

  function verify(body) {
    if (!body.start || !body.end) {
      legend.current.innerText = "Définissez un début et une fin valide";
      return false;
    }
    else {
      let start = new Date(body.start);
      let end = new Date(body.end);

      let diff = differenceInMinutes(end, start);

      if (!isSameDay(start, end)) {
        addToast('Erreur: le cours ne se termine pas le même jour qu\'au début', { appearance: 'error' });

        legend.current.innerText = 'Erreur';
        legend.current.style.backgroundColor = 'red';
        return false;
      }

      if (getDay(start) === 0) {
        addToast('Erreur: l\'emploi du temps ne gère pas les cours un Dimanche', { appearance: 'error' });

        legend.current.innerText = 'Erreur';
        legend.current.style.backgroundColor = 'red';
        return false;
      }

      if (diff < 15) {
        addToast('Erreur: le cours doit durer au moins un quart d\'heure.', { appearance: 'error' });

        legend.current.innerText = 'Erreur';
        legend.current.style.backgroundColor = 'red';
        return false;
      }

      legend.current.style.backgroundColor = '#000';
      legend.current.innerText = `Durée: ${formatDuration({ minutes: diff }, { format: ['minutes', 'hours'], locale: fr })}`;

      return true;
    }
  }

  return (
    <UserLayout user={user} flex={true}>
      <Title appendGradient="l'emploi du temps">
        Edition de
      </Title>
      <Form onSubmit={onSubmit} onError={onError}>
        <Fields.FormInput label="Début du cours" name="start" type="datetime-local" onChange={handleInputChange} value={values.start} required />
        <Fields.FormInput label="Fin du cours" name="end" type="datetime-local" onChange={handleInputChange} value={values.end} required />

        <legend ref={legend} style={{ backgroundColor: '#000', color: '#fff', padding: '2px 3px', margin: '1em 0 1em 0' }}>Définissez un début et une fin valide</legend>

        <Fields.FormSelect noOption="-- Sélectionnez un cours --" label="Cours" name="classId" onChange={handleInputChange} value={values.classId} options={(modules?.modules || []).map(x => { return { option: x.name + ' (' + x.module + ')', value: x.id } })} required />
        <Fields.FormSelect noOption="-- Sélectionnez un professeur --" label="Professeur" name="teacherId" onChange={handleInputChange} value={values.teacherId} options={(teachers?.users || []).map(x => { return { option: x.firstName + ' ' + x.lastName, value: x.userId } })} required />

        <Fields.FormInput label="Lien de la réunion" name="meetingUrl" onChange={handleInputChange} value={values.meetingUrl} type="url" placeholder="Lien Zoom, Google Meet, jit.si, Discord..." />

        <hr />
        <Fields.FormCheckboxList label="Groupes affectés" options={(groups?.groups || []).map(x => { return { label: x.name, id: x.id } })} />
        <Fields.FormButton type="submit">Ajouter à l'emploi du temps</Fields.FormButton>
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
