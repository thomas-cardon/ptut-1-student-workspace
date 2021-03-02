import withSession from "../lib/session";
import { getAvatar } from '../lib/useUser';

import UserLayout from '../components/UserLayout';
import Title from '../components/Title';

export default function SettingsPage({ user }) {
  return (
    <UserLayout user={user} flex={true}>
      <Title appendGradient={user.firstName}>
        Paramètres utilisateur:
      </Title>
      <code>
        NOM: {user.firstName} {user.lastName}
      </code>
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
