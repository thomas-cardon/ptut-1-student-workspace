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

export default function SchedulePage({ user, selectedWeek }) {
  const { data : schedule } = useSchedule(user);
  console.log(selectedWeek);

  let content = <h2 className={'title'}>Chargement</h2>;
  let data = (schedule || []).filter(x => {
    if ((getHours(x.end) > 19 && getMinutes(x.end) > 0) || getHours(x.start) < HOURS_MIN) {
      console.warn('Un bloc non sécurisé ne sera pas affiché dans l\'emploi du temps !');
      console.dir(x);

      return false;
    }

    if (getWeek(x.start) === selectedWeek || getWeek(new Date())) return true;
    return false;
  }).map(x => {
    const start = new Date(x.start), end = new Date(x.end);

    return {
      id: x.id,
      day: getDay(x.start),
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

  if (user) content = <Schedule data={data} />;

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
                <button key={i} disabled={selectedWeek ? (week + e) == selectedWeek : e === 0}>S-{week + e}</button>
            </Link>);
        })}
      </ButtonGroup>
    </>}>
      {content}
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
