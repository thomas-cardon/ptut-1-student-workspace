import UserLayout from '../components/UserLayout';

import useServiceWorker from '../lib/workers';
import withSession from "../lib/session";

export default function Dashboard({ user }) {
  useServiceWorker();

  return (
    <UserLayout user={user} flex={true}>
      <h1 className={'title'}>
        Salut, <span className={'gradient'}>{user.firstName}</span> !
      </h1>
      <code>{user ? (user?.group?.name || 'Groupe inconnu') : 'Chargement'}</code>
    </UserLayout>
  );
};

export const getServerSideProps = withSession(async function ({ req, res }) {
  const user = req.session.get('user');

  if (!user) {
    res.setHeader('location', '/login');
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }

  return {
    props: { user: req.session.get('user') },
  };
});
