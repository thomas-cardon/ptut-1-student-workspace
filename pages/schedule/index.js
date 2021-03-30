import Title from '../../components/Title';
import Link from '../../components/Link';

import UserLayout from '../../components/UserLayout';
import GroupList from '../../components/GroupList';

import Schedule from '../../components/Schedule';
import { ButtonGroup, FormButton } from '../../components/FormFields';

import { useSchedule } from '../../lib/hooks';
import withSession from "../../lib/session";

import { lightFormat, getDay, getWeek, getHours, getMinutes } from 'date-fns';

import { HiPlusCircle } from "react-icons/hi";

const HOURS_MIN = 8, HOURS_MAX = 19;

export default function SchedulePage({ user, selectedWeek = getWeek(new Date()) }) {
  const { data : schedule } = useSchedule(user);

  let data = (schedule || []).map(x => {
    x.start = new Date(x.start);
    x.end = new Date(x.end);

    return x;
  }).filter(x => {
    if ((getHours(x.end) > 19 && getMinutes(x.end) > 0) || getHours(x.start) < HOURS_MIN) {
      return false;
    }

    if (getWeek(x.start) == selectedWeek) return true;
    return false;
  }).map(x => {
    const start = new Date(x.start), end = new Date(x.end);

    return {
      id: x.id,
      day: getDay(x.start),
      dates: { start, end, },
      start: start.toLocaleTimeString().slice(0, 5).replace(':', ''),
      end: end.toLocaleTimeString().slice(0, 5).replace(':', ''),
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

  /* Calcul semaines */
  let todaydate = new Date();
  let oneJan =  new Date(todaydate.getFullYear(), 0, 1);
  let numberOfDays =  Math.floor((todaydate - oneJan) / (24 * 60 * 60 * 1000));

  return (
    <UserLayout user={user} flex={true} header={<>
      <Title appendGradient="temps" button={user.userType > 0 ?
        <Link href={{ pathname: '/schedule/edit' }}>
          <FormButton is="action" icon={<HiPlusCircle />}>Ajouter</FormButton>
        </Link> : <></>}>
        Emploi du
      </Title>
      <ButtonGroup style={{ width: 'fit-content', margin: 'auto'}}>
        {[-3, -2, -1, 0, 1, 2, 3].map((e, i) => {
          let week = Math.ceil((todaydate.getDay() + 1 + numberOfDays) / 7);
          return (
            <Link key={'week-' + i} href={{ pathname: '/schedule', query: { selectedWeek: week + e } }}>
                <FormButton is="action" key={i} disabled={selectedWeek ? (week + e) == selectedWeek : e === 0}>{week + e}</FormButton>
            </Link>);
        })}
      </ButtonGroup>
    </>}>
      <Schedule data={data} week={selectedWeek} />
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
