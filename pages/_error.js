import UserLayout from '../components/UserLayout';
import Highlight from '../components/Highlight';
import Title from '../components/Title';

import useUser from '../lib/useUser';

function Error({ statusCode }) {
  const { user } = useUser({ redirectTo: '/login' });

  return (
    <UserLayout user={user} flex={true} title="Erreur 404">
      <Title appendGradient={statusCode}>
        Erreur
      </Title>
      <Highlight title="Erreur:">
        {statusCode
          ? `An error ${statusCode} occurred on server`
          : 'An error occurred on client'}
      </Highlight>
    </UserLayout>
  );
};

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error;
