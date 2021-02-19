import useUser from '../../lib/useUser';
import useServiceWorker from '../../lib/workers';

import { useToasts } from 'react-toast-notifications';

import UserLayout from '../../components/UserLayout';

import Router from 'next/router';

import useSWR from 'swr';
import fetch from 'isomorphic-unfetch';
const fetcher = url => fetch(url).then(r => r.json());

import Form from "../../components/Form";
import * as Fields from "../../components/FormFields";

import MarkdownEditor from "../../components/MarkdownEditor";

function Page({ moduleId }) {
  useServiceWorker();

  const { user } = useUser({ redirectNotAuthorized: '/login', redirectOnError: '/error' }); /* Redirection si l'utilisateur n'est pas connecté */
  const { data, error } = useSWR('/api/class/list', fetcher);

  const { addToast } = useToasts();

  let content = <h1 className={'title'}>Chargement...</h1>;

  const onSubmit = async (e) => {
    e.preventDefault();

    let content = localStorage.getItem('posts.lastSavedState');

    try {
      const res = await fetch(location.protocol + '//' + location.host + '/api/posts/create', {
        body: JSON.stringify({
          title: e.target.title.value,
          content,
          classId: e.target.classId.value
        }),
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

  if (user && data) content = (<>
    <h1 className={'title'}>
      Edition d'un <span style={{ color: '#D56A53' }}>nouveau post</span>
    </h1>

    <p>Pas d'inquiétude, le contenu du post est enregistré sur votre navigateur tant qu'il n'est pas envoyé.</p>
    <div style={{ display: 'flex' }}>
      <MarkdownEditor />
      <Form onSubmit={onSubmit} onError={onError}>
        <Fields.FormInput label="Titre du post" id="title" name="title" type="text" placeholder="Titre" required />
        <Fields.FormSelect label="Cours" id="classId" name="classId" options={data.modules.map(x => { return { option: 'Cours ' + x.module, value: x.id } })} />
        <Fields.FormButton type="submit">Créer un nouveau post</Fields.FormButton>
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
