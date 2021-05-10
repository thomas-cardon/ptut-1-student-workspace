import UserLayout from '../components/UserLayout';
import Title from '../components/Title';

import Highlight from '../components/Highlight';

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import useUser from '../lib/useUser';

export default function OfflinePage() {
  const { user } = useUser();

  return (
    <UserLayout user={user} flex={true}>
      <Title appendGradient={(user?.firstName || 'inconnu') + ' !'} subtitle={' — ' + (user?.group?.name || 'Groupe inconnu')}>
        Salut,
      </Title>

      <Highlight>Vous êtes hors-ligne. Connectez-vous afin d'accéder aux pages nécessitant une connexion à internet.</Highlight>
    </UserLayout>
  );
};
