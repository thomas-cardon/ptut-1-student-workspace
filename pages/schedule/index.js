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

export default function SchedulePage() {
  /*
  *  Variable definitions
  */
  const selectedWeek = getISOWeek(new Date());


  const { user } = useUser({ redirectTo: '/login' });
  const [week, setWeek] = useState(selectedWeek);

  /*
  *  End of variable definitions
  */
  return (
    <UserLayout user={user} flex={true} header={<>
      <Title appendGradient="temps" subtitle={`Semaine ${week}`} button={<>
        <ButtonGroup>
          <FormButton disabled={selectedWeek === 0} onClick={() => setWeek(week - 1)}>{"«"}</FormButton>
          {[-1, 0, 1].map((e, i) => {
            return (<FormButton key={i} disabled={(selectedWeek + e) === week} onClick={() => setWeek(selectedWeek + e)}>{selectedWeek + e}</FormButton>);
          })}
          <FormButton disabled={selectedWeek === 52} onClick={() => setWeek(week + 1)}>{"»"}</FormButton>
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
      {user && <Schedule index={week} user={user} />}
    </UserLayout>
  );
};
