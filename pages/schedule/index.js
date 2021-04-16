import React, { useEffect, useState } from 'react';

import dynamic from 'next/dynamic';

import Title from '../../components/Title';
import Link from '../../components/Link';

import UserLayout from '../../components/UserLayout';
import GroupList from '../../components/GroupList';

import { ButtonGroup, FormButton } from '../../components/FormFields';

import { useSchedule } from '../../lib/hooks';
import withSession from "../../lib/session";

import { getISOWeek } from 'date-fns';

import { HiPlusCircle } from "react-icons/hi";
import Loader from 'react-loader-spinner';

const Schedule = dynamic(() => import('../../components/Schedule'), {
  loading: () => <Loader type="Oval" color="var(--color-accent)" height="5em" width="100%" />
});

const HOURS_MIN = 8, HOURS_MAX = 19;

export default function SchedulePage({ user, selectedWeek }) {
  selectedWeek = parseInt(selectedWeek) || getISOWeek(new Date());

  const [week, setWeek] = useState(0);

  useEffect(() => {
    /* Calcul semaines */
    let todaydate = new Date();
    let oneJan =  new Date(todaydate.getFullYear(), 0, 1);
    let numberOfDays =  Math.floor((todaydate - oneJan) / (24 * 60 * 60 * 1000));

    setWeek(Math.ceil((todaydate.getDay() + 1 + numberOfDays) / 7));
  }, []);

  return (
    <UserLayout user={user} flex={true} header={<>
      <Title appendGradient="temps" subtitle={`Semaine ${selectedWeek}`} button={user.userType > 0 ?
        <Link href={{ pathname: '/schedule/edit' }}>
          <FormButton is="action" icon={<HiPlusCircle />}>Ajouter</FormButton>
        </Link> : <></>}>
        Emploi du
      </Title>
      <ButtonGroup style={{ width: 'fit-content', margin: 'auto'}}>
        <Link href={{ pathname: '/schedule', query: { selectedWeek: selectedWeek - 1 } }}>
            <FormButton is="action" disabled={selectedWeek === 0}>{"<"}</FormButton>
        </Link>
        {[-3, -2, -1, 0, 1, 2, 3].map((e, i) => {
          return (
            <Link key={'week-' + i} href={{ pathname: '/schedule', query: { selectedWeek: week + e } }}>
                <FormButton is="action" key={i} disabled={selectedWeek ? (week + e) === selectedWeek : e === 0}>{week + e}</FormButton>
            </Link>);
        })}
        <Link href={{ pathname: '/schedule', query: { selectedWeek: selectedWeek + 1 } }}>
            <FormButton is="action" disabled={selectedWeek === 52}>{">"}</FormButton>
        </Link>
      </ButtonGroup>
    </>}>
      <Schedule index={selectedWeek} user={user} />
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
