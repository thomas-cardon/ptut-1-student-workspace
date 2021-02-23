import { useRouter } from 'next/router';

import Link from 'next/link';
import UserLayout from '../../components/UserLayout';
import Highlight from "../../components/Highlight";

import Form from "../../components/Form";
import * as Fields from "../../components/FormFields";

import useSWR from 'swr';
import { useUserById } from '../../lib/useUser';
import fetcher from '../../lib/fetchJson';
import withSession from "../../lib/session";

import { useToasts } from 'react-toast-notifications';

export default function EditUserPage({ user, id }) {
  const { addToast } = useToasts();
  const router = useRouter();

  const { data, error } = useSWR('/api/groups/list', fetcher);
  const { user : requested } = useUserById(id);

  console.dir(user);

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(location.protocol + '//' + location.host + '/api/users/' + (id || 'create'), {
        body: JSON.stringify({
          email: e.target.email.value,
          firstName: e.target.firstName.value,
          lastName: e.target.lastName.value,
          birthDate: e.target.birthDate.value,
          groupId: parseInt(e.target.groupId.value),
          userType: e.target.userType.value == -1 ? null : e.target.userType.value
        }),
        headers: { 'Content-Type': 'application/json' },
        method: id ? 'PUT' : 'POST'
      });

      const result = await res.json();
      console.dir(result);

      if (result.success) {
        addToast('Utilisateur ' + (id ? 'édité' : 'créé') + ' avec succès -> #' + result.id, { appearance: 'success' });
        router.push('/users/list');
      }
      else addToast(result.error || 'Une erreur s\'est produite', { appearance: 'error' });
    }
    catch(error) {
      addToast(error, { appearance: 'error' });
      console.error(error);
    }
  }

  const onError = (errors, e) => {
    addToast("Une erreur s'est produite.", { appearance: 'error' });
    console.error(errors, e);
  }

  return (
    <UserLayout user={user} flex={true}>
      <h1 className={'title'}>
      {id ? 'Edition d\'un' : 'Création d\'un nouvel'} <span className={'gradient'}>utilisateur</span>
      </h1>
      {id && (
        <h3 className={'subtitle'}>
          Utilisateur #{id}
        </h3>
      )}
      <div className={'grid'}>
        {!id && (
          <Highlight title="IMPORTANT">L'utilisateur devra réinitialiser son mot de passe depuis la page de connexion afin de pouvoir se connecter</Highlight>
        )}
        <Form onSubmit={onSubmit} onError={onError}>
          <Fields.FormInput defaultValue={requested?.user?.email} label="Adresse e-mail" id="email" name="email" type="email" placeholder="exemple@exemple.fr" required />
          <Fields.FormInput defaultValue={requested?.user?.firstName} label="Prénom" id="firstName" name="firstName" type="text" placeholder="DUJARDIN" required />
          <Fields.FormInput defaultValue={requested?.user?.lastName} label="Nom" id="lastName" name="lastName" type="text" placeholder="Jean" required />
          <Fields.FormInput defaultValue={requested?.user?.birthDate.slice(0, 10)} label="Date de naissance" id="birthDate" name="birthDate" type="date" placeholder="DUJARDIN" required />

          <Fields.FormSelect defaultValue="-1" label="Groupe" id="groupId" name="groupId" options={[{ name: 'Aucun groupe', id: -1 }].concat(data?.groups || []).map(x => { return { option: x.name, value: x.id } })} />
          <Fields.FormSelect defaultValue="0" label="Type" id="userType" name="userType" options={[{ option: 'Etudiant', value: 0 }, { option: 'Professeur', value: 1 }, { option: 'Administration', value: 2 }]} />

          <Fields.FormButton type="submit">{id ? 'Editer cet utilisateur' : 'Créer un nouvel utilisateur'}</Fields.FormButton>
        </Form>
      </div>
    </UserLayout>
  );
};

export const getServerSideProps = withSession(async function ({ req, res, query }) {
  const user = req.session.get('user');

  if (!user || user.userType !== 2) {
    res.setHeader('location', '/login');
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }

  return {
    props: { user: req.session.get('user'), ...query },
  };
});
