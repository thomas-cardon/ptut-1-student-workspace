import useSWR from 'swr';
import useUser from '../lib/useUser';
import fetcher from '../lib/fetchJson';

import UserLayout from '../components/UserLayout';

export default function Schedule({ props }) {
  const { user } = useUser({ redirectNotAuthorized: '/login', redirectOnError: '/error' }); /* Redirection si l'utilisateur n'est pas connecté */
  if (!user) return <div>Loading...</div>;

  return (
    <UserLayout user={user}>
      <h1 className={'title'}>
        Emploi du temps
      </h1>
      <div className={'grid'}>
      </div>
    </UserLayout>
  );
};
