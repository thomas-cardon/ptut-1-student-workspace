import useSWR from 'swr';
import useUser from '../../../lib/useUser';
import useServiceWorker from '../../../lib/workers';

import UserLayout from '../../../components/UserLayout';

function Page({ moduleId }) {
  useServiceWorker();

  const { user } = useUser({ redirectNotAuthorized: '/login', redirectOnError: '/error' }); /* Redirection si l'utilisateur n'est pas connecté */
  if (!user) return <div>Loading...</div>

  return (
    <UserLayout user={user} flex={true}>
      <h1 className={'title'}>
        Cours <span style={{ color: '#D56A53' }}>{moduleId.toUpperCase()}</span>
      </h1>
    </UserLayout>
  );
};

export function getServerSideProps(ctx) {
  return { props: ctx.query };
}

export default Page;
