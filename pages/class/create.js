import useUser from '../../lib/useUser';
import useServiceWorker from '../../lib/workers';

import UserLayout from '../../components/UserLayout';

import useSWR from 'swr';
import fetch from 'isomorphic-unfetch';
const fetcher = url => fetch(url).then(r => r.json());

function Page({ moduleId }) {
  useServiceWorker();

  const { user } = useUser({ redirectNotAuthorized: '/login', redirectOnError: '/error' }); /* Redirection si l'utilisateur n'est pas connecté */
  let content = <h1 className={'title'}>Chargement...</h1>;

  if (user) content = (<>
    <h1 className={'title'}>
      Edition d'un <span style={{ color: '#D56A53' }}>nouveau cours</span>
    </h1>
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
