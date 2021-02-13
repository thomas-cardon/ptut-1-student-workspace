import useSWR from 'swr';
import useUser from '../lib/useUser';

import UserLayout from '../components/UserLayout';

export default function Dashboard({ props }) {
  const { user } = useUser({ redirectNotAuthorized: '/login', redirectOnError: '/error' }); /* Redirection si l'utilisateur n'est pas connecté */
  if (!user) return <div>Loading...</div>


  return (
    <UserLayout user={user} flex={true}>
      <h1 className={'title'}>
        Paramètres utilisateur
      </h1>
      <h2 className={'title'}>
        {user.firstName} {user.lastName}
      </h2>
      <img style={{ borderRadius: '50%', width: '10%' }} src="https://placem.at/places?w=500&h=500&txt=" />
    </UserLayout>
  );
};
