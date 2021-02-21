import UserLayout from '../components/UserLayout';

import useSWR from 'swr';
import { useUser } from '../lib/useUser';

import useServiceWorker from '../lib/workers';

export default function Dashboard({ props }) {
  useServiceWorker();

  const { user } = useUser({ redirectNotAuthorized: '/login', redirectOnError: '/error' }); /* Redirection si l'utilisateur n'est pas connecté */

  let content;

  if (!user) content = <h1 className={'title'}>Chargement...</h1>
  else content = (<>
    <h1 className={'title'}>
      Salut, <span className={'gradient'}>{user.firstName}</span> !
    </h1>
    <code>{user.group.name || "Groupe inconnu"}</code>
  </>);

  return (
    <UserLayout user={user} flex={true}>
      {content}
    </UserLayout>
  );
};
