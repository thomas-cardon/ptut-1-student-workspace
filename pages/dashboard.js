import useSWR from 'swr';
import useUser from '../lib/useUser';

import UserLayout from '../components/UserLayout';

export default function Dashboard({ props }) {
  const { user } = useUser({ redirectNotAuthorized: '/login', redirectOnError: '/error' }); /* Redirection si l'utilisateur n'est pas connecté */
  if (!user) return <div>Loading...</div>

  console.dir(user);

  return (
    <UserLayout user={user} flex={true}>
      <h1 className={'title'}>
        Salut, {user.firstName} !
      </h1>
    </UserLayout>
  );
};
