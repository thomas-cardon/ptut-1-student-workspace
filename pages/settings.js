import withSession from "../lib/session";
import { getAvatar } from '../lib/useUser';

import UserLayout from '../components/UserLayout';

export default function Settings({ user }) {
  return (
    <UserLayout user={user} flex={true}>
      <h1 className={'title'}>
        Paramètres utilisateur
      </h1>
      <h2 className={'title'}>
        {user.firstName} {user.lastName}
      </h2>
      <img style={{ borderRadius: '50%', width: '10%' }} src={getAvatar(user)} />
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
