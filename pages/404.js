import UserLayout from '../components/UserLayout';
import Highlight from '../components/Highlight';
import Title from '../components/Title';

import useUser from '../lib/useUser';

export default function Error404() {
  const { user } = useUser({ redirectTo: '/login' });

  return (
    <UserLayout user={user} flex={true} title="Erreur 404">
      <Title appendGradient="404">
        Erreur
      </Title>
      <Highlight title="Erreur">
        La page demandée n'est pas disponible.
      </Highlight>
    </UserLayout>
  );
};
