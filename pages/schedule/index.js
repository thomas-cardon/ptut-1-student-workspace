import React, { useEffect, useState } from 'react';
import Loader from 'react-loader-spinner';
import dynamic from 'next/dynamic';

import Title from '../../components/Title';
import Link from '../../components/Link';

import UserLayout from '../../components/UserLayout';
import GroupList from '../../components/GroupList';

import { ButtonGroup, FormButton } from '../../components/FormFields';

import useUser from '../../lib/useUser';
import { getISOWeek } from 'date-fns';

import { HiPlusCircle } from "react-icons/hi";

const Schedule = dynamic(() => import('../../components/Schedule'), {
  loading: () => <Loader type="Oval" color="var(--color-accent)" height="5em" width="100%" />
});

export default function SchedulePage({ selectedWeek }) {
  /*
  *  Variable definitions
  */

  const { user } = useUser({ redirectTo: '/login' });
  const [week, setWeek] = useState(0);

  selectedWeek = parseInt(selectedWeek) || getISOWeek(new Date());


  useEffect(() => {
    /* Calcul semaines */
    let todaydate = new Date();
    let oneJan =  new Date(todaydate.getFullYear(), 0, 1);
    let numberOfDays =  Math.floor((todaydate - oneJan) / (24 * 60 * 60 * 1000));

    setWeek(Math.ceil((todaydate.getDay() + 1 + numberOfDays) / 7));
  }, []);

  /*
  *  End of variable definitions
  */
  return (
    <UserLayout user={user} flex={true} header={<>
      <Title appendGradient="temps" subtitle={`Semaine ${selectedWeek}`} button={<>
        <ButtonGroup>
          <Link href={{ pathname: '/schedule', query: { selectedWeek: selectedWeek - 1 } }}>
              <FormButton disabled={selectedWeek === 0}>{"«"}</FormButton>
          </Link>
          {[-1, 0, 1].map((e, i) => {
            return (
              <Link key={'week-' + i} href={{ pathname: '/schedule', query: { selectedWeek: selectedWeek + e } }}>
                  <FormButton key={i} disabled={e === 0}>{selectedWeek + e}</FormButton>
              </Link>);
          })}
          <Link href={{ pathname: '/schedule', query: { selectedWeek: selectedWeek + 1 } }}>
              <FormButton disabled={selectedWeek === 52}>{"»"}</FormButton>
          </Link>
          {user?.userType > 0 && (
            <Link href={{ pathname: '/schedule/edit' }}>
              <FormButton is="action" icon={<HiPlusCircle />}>Ajouter</FormButton>
            </Link>
          )}
        </ButtonGroup>
        </>}>
        Emploi du
      </Title>
    </>}>
      {user && <Schedule index={selectedWeek} user={user} />}
    </UserLayout>
  );
};
