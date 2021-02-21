import { useUser } from '../../../lib/useUser';
import useServiceWorker from '../../../lib/workers';

import UserLayout from '../../../components/UserLayout';

import useSWR from 'swr';
import fetcher from '../../../lib/fetchJson';
import withSession from "../../../lib/session";

export default function ClassPage({ user, moduleId }) {
  const { data } = useSWR('/api/class/' + moduleId, fetcher);
  const { postsData } = useSWR('/api/posts/by-module/' + moduleId, fetcher);

  let content = <h1 className={'title'}>Chargement...</h1>;

  if (data) content = (<>
    <h1 className={'title'}>
      Cours <span style={{ color: '#D56A53' }}>{moduleId.toUpperCase()}</span>
    </h1>
    <p>{data.success && data.module.name}</p>
    <p>{(!data.success && data.error === "Not found") && "Le cours n'existe pas!"}</p>
  </>);

  return (
    <UserLayout user={user} flex={true}>
      {content}
    </UserLayout>
  );
};

export const getServerSideProps = withSession(async function ({ req, res, query, params }) {
  const user = req.session.get('user');

  if (!user) {
    res.setHeader('location', '/login');
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }

  return {
    props: { user: req.session.get('user'), ...params },
  };
});
