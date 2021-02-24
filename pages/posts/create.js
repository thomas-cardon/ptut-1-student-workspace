import Router from 'next/router';
import dynamic from 'next/dynamic';

import UserLayout from '../../components/UserLayout';
import Highlight from "../../components/Highlight";

import Form from "../../components/Form";
import * as Fields from "../../components/FormFields";

import { useToasts } from 'react-toast-notifications';

import useSWR from 'swr';
import fetcher from '../../lib/fetchJson';
import withSession from "../../lib/session";

const Editor = dynamic(() => import("../../components/Editor"), { ssr: false });

export default function CreatePostPage({ user, moduleId }) {
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
      Edition d'un <span className={'gradient'}>nouveau post</span>
    </h1>

    <Highlight title={'Le saviez-vous?'}>Le contenu du post est enregistré sur votre navigateur tant qu'il n'est pas envoyé.</Highlight>
    <Form onSubmit={onSubmit} onError={onError}>
      <Fields.FormInput label="Titre du post" id="title" name="title" type="text" placeholder="Titre" required />
      <Fields.FormSelect label="Cours" id="classId" name="classId" options={data.modules.map(x => { return { option: 'Cours ' + x.module, value: x.id } })} />
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
