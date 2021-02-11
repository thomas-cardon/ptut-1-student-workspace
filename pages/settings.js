import useSWR from 'swr';
import useUser from '../lib/useUser';

import BasicLayout from '../components/BasicLayout';

export default function Dashboard({ props }) {
  const { user } = useUser({ redirectNotAuthorized: '/login', redirectOnError: '/error' }); /* Redirection si l'utilisateur n'est pas connecté */
  if (!user) return <div>Loading...</div>

  console.dir(user);

  return (
    <BasicLayout>
      <h1 className={'title'}>
        Paramètres utilisateur
      </h1>
      <h2 className={'title'}>
        {user.firstName} {user.lastName}
      </h2>
    </BasicLayout>
  );
};
