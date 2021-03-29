import React, { useState, useRef } from 'react';
import Router from 'next/router';

import UserLayout from '../../components/UserLayout';
import Title from '../../components/Title';

import Form from "../../components/Form";
import * as Fields from "../../components/FormFields";

import { useToasts } from 'react-toast-notifications';

import use from '../../lib/use';
import { useGroups, useUsers, useSubjects } from '../../lib/hooks';
import withSession from "../../lib/session";

import { formatDuration, differenceInMinutes, isSameDay, getDay, addMinutes } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function EditSchedulePage({ user }) {
  /*
   * Variable definitions
   */
   const [values, setValues] = useState({ start: '', end: '', subjectId: '', teacherId: '', meetingUrl: '', room: '' });

   const handleInputChange = e => {
     const { name, value } = e.target;
     setValues({ ...values, [name]: value});
     verify();
   };

   const [legend, setLegend] = useState({ backgroundColor: 'red', text: 'Définissez un début et une fin valide' });

   const { data : subjects } = useSubjects();
   const { data : groups } = useGroups();
   const { data : teachers } = useUsers(1);

   const { addToast } = useToasts();

  /*
   * End of variable definitions
   */

  const onSubmit = async (e) => {
    e.preventDefault();

    let body = {
      start: new Date(values.start).getTime() / 1000,
      duration: differenceInMinutes(new Date(values.end.slice(0, 19).replace('T', ' ')), new Date(values.start.slice(0, 19).replace('T', ' '))),
      subjectId: parseInt(values.subjectId),
      teacherId: parseInt(values.teacherId),
      meetingUrl: values.meetingUrl,
      concernedGroups: Array.from(e.target.childNodes[8].querySelectorAll('*')).filter(x => x.nodeName === "INPUT" && x.checked).map(x => { return parseInt(x.getAttribute('data-id')); })
    };

    console.dir(body);
    if (!verify(true)) return addToast('Impossible de vérifier le contenu du formulaire', { appearance: 'error' });

    try {
      const res = await fetch(location.protocol + '//' + location.host + '/api/schedule/add', {
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

  function verify(alert) {
    if (!values.start || !values.end) {
      if (alert) addToast('Erreur: Définissez un début et une fin valide', { appearance: 'error' });
      else setLegend({ backgroundColor: 'red', text: 'Définissez un début et une fin valide' });
      return false;
    }
    else {
      let start = new Date(values.start);
      let end = new Date(values.end);

      let diff = differenceInMinutes(end, start);

      if (!isSameDay(start, end)) {
        if (alert) addToast('Erreur: le cours ne se termine pas le même jour qu\'au début', { appearance: 'error' });
        else setLegend({ backgroundColor: 'red', text: 'Le cours ne se termine pas le même jour qu\'au début' });
        return false;
      }

      if (getDay(start) === 0) {
        if (alert) addToast('Erreur: l\'emploi du temps ne gère pas les cours un Dimanche', { appearance: 'error' });
        else setLegend({ backgroundColor: 'red', text: "C'est un dimanche" });
        return false;
      }

      if (diff < 15) {
        if (alert) addToast('Erreur: le cours doit durer plus de 15 minutes', { appearance: 'error' });
        else setLegend({ backgroundColor: 'red', text: "< 15 minutes" });
        return false;
      }

      console.dir(values);

      setLegend({ backgroundColor: '#000', text: `Durée: ${Math.floor((end - start) / (1000*60))} minutes` });
      return true;
    }
  }

  return (
    <UserLayout user={user} flex={true} header={<>
        <Title appendGradient="l'emploi du temps">
          Edition de
        </Title>
      </>}>
      <Form onSubmit={onSubmit} style={{ width: '80%', padding: '1em', margin: 'auto', borderRadius: '8px', backgroundColor: 'var(--color-primary-800)' }}>
        <Fields.FormInput label="Début du cours" name="start" type="datetime-local" onChange={handleInputChange} value={values.start} required />
        <Fields.FormInput label="Fin du cours" name="end" type="datetime-local" onChange={handleInputChange} value={values.end} required />

        <legend style={{ backgroundColor: legend.backgroundColor, color: '#fff', padding: '2px 3px', margin: '1em 0 1em 0' }}>{legend.text}</legend>

        <Fields.FormSelect noOption="-- Sélectionnez un cours --" label="Cours" name="subjectId" onChange={handleInputChange} value={values.subjectId} options={(subjects || []).map(x => { return { option: x.name + ' (' + x.module + ')', value: x.id } })} required />
        <Fields.FormSelect noOption="-- Sélectionnez un professeur --" label="Professeur" name="teacherId" onChange={handleInputChange} value={values.teacherId} options={(teachers || []).map(x => { return { option: x.firstName + ' ' + x.lastName, value: x.userId } })} required />

        <Fields.FormInput label="Lien de la réunion" name="meetingUrl" onChange={handleInputChange} value={values.meetingUrl} type="url" placeholder="Lien Zoom, Google Meet, jit.si, Discord..." />
        <Fields.FormInput label="Salle (facultatif)" name="room" onChange={handleInputChange} value={values.room} type="text" placeholder="Exemple: Salle 100, Salle TD 1, Bâtiment B..." />
        <hr />
        <Fields.FormCheckboxList label="Groupes affectés" options={(groups || []).map(x => { return { label: x.name, id: x.id } })} />
        <Fields.FormButton is="danger" type="submit" style={{ margin: '2em 0', width: '100%' }}>Ajouter à l'emploi du temps</Fields.FormButton>
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
