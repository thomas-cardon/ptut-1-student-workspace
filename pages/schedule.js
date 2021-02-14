import useSWR from 'swr';
import useUser from '../lib/useUser';
import fetcher from '../lib/fetchJson';

import UserLayout from '../components/UserLayout';

export default function Schedule({ props }) {
  const { user } = useUser({ redirectNotAuthorized: '/login', redirectOnError: '/error' }); /* Redirection si l'utilisateur n'est pas connecté */

  let content;

  if (!user) content = <h2 className={'title'}>Chargement</h2>;
  else content = (
    <div>
      <img src="https://i.postimg.cc/Gp3dFNbK/image.png" />
    </div>);

  return (
    <UserLayout user={user} flex={true}>
      <h1 className={'title'}>
        Emploi du temps
      </h1>
      <div className={'grid'}>
        {content}
      </div>
    </UserLayout>
  );
};
