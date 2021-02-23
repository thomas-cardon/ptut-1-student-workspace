import React, { useRef } from 'react';
import Router from 'next/router';

import UserLayout from '../../components/UserLayout';

import Form from "../../components/Form";
import * as Fields from "../../components/FormFields";

import { useToasts } from 'react-toast-notifications';

import use from '../../lib/use';
import useSWR from 'swr';
import fetcher from '../../lib/fetchJson';
import withSession from "../../lib/session";

import { formatDuration, differenceInMinutes, isSameDay, getDay } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function EditSchedulePage({ user }) {
  const { data : modules } = use({ url: '/api/class/list' });
  const { data : groups } = use({ url: '/api/groups/list' });
  const { data : teachers } = use({ url: '/api/users/list?queryUserType=1' });

  const { addToast } = useToasts();

  const form = useRef(null), legend = useRef(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!verify()) return;

    try {
      const res = await fetch(location.protocol + '//' + location.host + '/api/schedule/add', {
        body: JSON.stringify({
          start: e.target[0].value.slice(0, 19).replace('T', ' '),
          duration: 120,
          classId: parseInt(e.target[2].value),
          concernedGroups: Array.from(e.target.childNodes[6].querySelectorAll('*')).filter(x => x.nodeName === "INPUT" && x.checked).map(x => { return parseInt(x.getAttribute('data-id')); }),
          teacherId: parseInt(e.target[3].value)
        }),
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

  function verify() {
    let start = form.current[0].value, end = form.current[1].value;

    if (!start || !end) {
      legend.current.innerText = "Définissez un début et une fin valide";
      return false;
    }
    else {
      start = new Date(start);
      end = new Date(end);

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
      <h1 className={'title'}>Edition de&nbsp;
        <span className={'gradient'}>l'emploi du temps</span>
      </h1>
      <Form ref={form} onSubmit={onSubmit} onError={onError}>
        <Fields.FormGroup label="Début du cours" name="start">
          <input id="start" name="start" type="datetime-local" onChange={verify} required />
        </Fields.FormGroup>
        <Fields.FormGroup label="Fin du cours" name="end">
          <input id="end" name="end" type="datetime-local" onChange={verify} required />
        </Fields.FormGroup>

        <legend ref={legend} style={{ backgroundColor: '#000', color: '#fff', padding: '2px 3px', margin: '1em 0 1em 0' }}>Définissez un début et une fin valide</legend>

        <Fields.FormSelect label="Cours" id="classId" name="classId" options={(modules?.modules || []).map(x => { return { option: x.name + ' (' + x.module + ')', value: x.id } })} />
        <Fields.FormSelect label="Professeur" id="teacherId" name="teacherId" options={(teachers?.users || []).map(x => { return { option: x.firstName + ' ' + x.lastName, value: x.userId } })} />

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
