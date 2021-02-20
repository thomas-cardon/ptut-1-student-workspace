import Link from 'next/link';

import UserLayout from '../../components/UserLayout';
import GroupList from '../../components/GroupList';

import Schedule from '../../components/Schedule';

import useSWR from 'swr';

import use from '../../lib/use';
import { useUser } from '../../lib/useUser';

import { lightFormat, getDay } from 'date-fns';

export default function Page({ props }) {
  const { user } = useUser({ redirectNotAuthorized: '/login', redirectOnError: '/error' }); /* Redirection si l'utilisateur n'est pas connecté */
  const { data : schedule } = use({ url: '/api/schedule' });

  console.dir(schedule);

  let content = <h2 className={'title'}>Chargement</h2>;
  let data = (schedule?.schedule || []).map(x => {
    let start = new Date(x.start);
    return {
      day: getDay(start),
      start: lightFormat(start, 'HHmm'),
      end: lightFormat(new Date(start.getTime() + x.duration * 60000), 'HHmm'),
      module: x.module,
      name: x.moduleName,
      room: "Salle TD 2 - 3",
      color: x?.color,
      teacher: x.teacherFirstName + ' ' + x.teacherLastName
    };
  });

  if (user) content = (
    <>
      {/*<GroupList />*/}
      <Schedule classes={data} />
    </>);

  return (
    <UserLayout user={user} flex={true}>
      <h1 className={'title'}>
        Emploi du <span className={'gradient'}>temps</span>
      </h1>
      <h3 className={'subtitle'}>
        <Link href='/schedule/edit'>
          <a>Ajouter...</a>
        </Link>
      </h3>
      <div className={'grid'} style={{ width: '98%', margin: '0' }}>
        {content}
      </div>
    </UserLayout>
  );
};
