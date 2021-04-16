import UserLayout from '../../../components/UserLayout';

import fetch from 'isomorphic-unfetch';
const fetcher = url => fetch(url).then(r => r.json());

import { useSubject, usePosts } from '../../../lib/hooks';
import withSession from "../../../lib/session";

export default function SubjectPage({ user, moduleId }) {
  const { data : subject } = useSubject(moduleId);
  const { data : posts } = usePosts(null, 0, moduleId);

  let content = <h1 className={'title'}>Chargement...</h1>;

  if (posts) content = (<>
    <h1 className={'title'}>
      Cours <span style={{ color: '#D56A53' }}>{moduleId.toUpperCase()}</span>
    </h1>
    <p>{subject.module.name}</p>
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
