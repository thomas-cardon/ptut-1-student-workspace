import Link from 'next/link';

import UserLayout from '../../components/UserLayout';
import GroupList from '../../components/GroupList';

import Schedule from '../../components/Schedule';

import useSWR from 'swr';
import use from '../../lib/use';
import withSession from "../../lib/session";

import { lightFormat, getDay } from 'date-fns';

export default function SchedulePage({ user }) {
  const { data : schedule } = use({ url: '/api/schedule' });

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
      teacher: x.teacherFirstName + ' ' + x.teacherLastName,
      meetingurl: x?.meetingurl
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
      <div className={'grid'} style={{ width: '100%', margin: '0' }}>
        {content}
      </div>
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
