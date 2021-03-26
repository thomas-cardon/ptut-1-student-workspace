import Link from '../../components/Link';

import UserLayout from '../../components/UserLayout';
import GroupList from '../../components/GroupList';

import Schedule from '../../components/Schedule';
import { ButtonGroup } from '../../components/FormFields';

import { useSchedule } from '../../lib/hooks';
import withSession from "../../lib/session";

import { lightFormat, getDay } from 'date-fns';

import { HiPlus } from "react-icons/hi";

export default function SchedulePage({ user, selectedWeek }) {
  const { data : schedule } = useSchedule(user);

  let content = <h2 className={'title'}>Chargement</h2>;
  let data = (schedule || []).map(x => {
    let start = new Date(x.start), end = new Date(start.getTime() + x.duration * 60 * 1000);

    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      start.setHours(start.getHours() + 1);
      end.setHours(end.getHours() + 1);
    }

    const startIso = start.toISOString(), endIso = end.toISOString();

    return {
      id: x.id,
      day: getDay(start),
      start: startIso.slice(11, 16).replace(':', ''),
      end: endIso.slice(11, 16).replace(':', ''),
      module: x.module,
      name: x.subjectName,
      room: x.room,
      groupId: x.groupId,
      groupName: x.groupName,
      color: x.color,
      teacher: x.teacherFirstName + ' ' + x.teacherLastName,
      meetingUrl: x?.meetingUrl
    };
  });

  if (user) content = <Schedule data={data} />;

  /* Calcul semaines */
  let todaydate = new Date();
  let oneJan =  new Date(todaydate.getFullYear(), 0, 1);
  let numberOfDays =  Math.floor((todaydate - oneJan) / (24 * 60 * 60 * 1000));

  return (
    <UserLayout user={user} flex={true} header={<>
      <Link href={{ pathname: '/schedule/edit' }}>
        <button><HiPlus /></button>
      </Link>
      <ButtonGroup>
        {[-3, -2, -1, 0, 1, 2, 3].map((e, i) => {
          let week = Math.ceil((todaydate.getDay() + 1 + numberOfDays) / 7);
          return (
            <Link key={'week-' + i} href={{ pathname: '/schedule', query: { selectedWeek: week + e } }}>

                <button key={i} disabled={selectedWeek ? (week + e) == selectedWeek : e === 0}>S-{week + e}</button>

            </Link>);
        })}
      </ButtonGroup>
    </>}>
      <div className={'grid'} style={{ width: '100%', margin: '0' }}>
        {content}
      </div>
    </UserLayout>
  );
};

export const getServerSideProps = withSession(async function ({ req, res, query }) {
  const user = req.session.get('user');

  if (!user) {
    res.setHeader('location', '/login');
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }

  return {
    props: { user: req.session.get('user'), ...query },
  };
});
