import useSWR from 'swr';
import useUser from '../lib/useUser';

import UserLayout from '../components/UserLayout';
import GroupList from '../components/GroupList';

import Schedule from '../components/Schedule';

export default function Page({ props }) {
  const { user } = useUser({ redirectNotAuthorized: '/login', redirectOnError: '/error' }); /* Redirection si l'utilisateur n'est pas connecté */

  let content;
  let data = [
    { day: 1, start: '0815', end: '1015', module: 'M1107', name: 'PPP', room: 'Salle TD 2 - 3', teacher: 'SALOU BACCINO Alexandra' },
    { day: 1, start: '1030', end: '1215', module: 'M1202', name: 'Analyse', room: 'Salle TD 2 - 3', teacher: 'ISAMBARD Gurval' },
    { day: 2, start: '0815', end: '1215', module: 'M2107', name: 'PTUT', room: 'Salle TD 2 - 1' }
  ];

  if (!user) content = <h2 className={'title'}>Chargement</h2>;
  else content = (
    <>
      {/*<GroupList />*/}
      <Schedule classes={data} />
    </>);

  return (
    <UserLayout user={user} flex={true}>
      <h1 className={'title'}>
        Emploi du temps
      </h1>
      <div className={'grid'} style={{ width: '98%', margin: '0' }}>
        {content}
      </div>
    </UserLayout>
  );
};
