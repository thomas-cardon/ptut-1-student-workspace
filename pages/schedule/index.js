import React, { useEffect, useState } from 'react';
import Loader from 'react-loader-spinner';
import dynamic from 'next/dynamic';

import useUser from '../../lib/useUser';
import { uni, getSchoolYears } from '../../lib/ade';

import { getISOWeek } from 'date-fns';

import Title from '../../components/Title';
import Link from '../../components/Link';

import UserLayout from '../../components/UserLayout';
import GroupList from '../../components/GroupList';

import { ButtonGroup, FormButton } from '../../components/FormFields';

import { HiDotsHorizontal, HiViewGrid, HiViewList } from "react-icons/hi";

import {
  Menu,
  Item,
  Separator,
  Submenu,
  useContextMenu
} from "react-contexify";

import "react-contexify/dist/ReactContexify.css";

const MENU_ID = "SCHEDULE-OPTIONS";
const Schedule = dynamic(() => import('../../components/Schedule'), {
  loading: () => <Loader type="Oval" color="var(--color-accent)" height="5em" width="100%" />
});

const isServer = () => typeof window === `undefined`;

export default function SchedulePage() {
  /*
  *  Variable definitions
  */
  const selectedWeek = getISOWeek(new Date());

  const { user } = useUser({ redirectTo: '/login' });
  const { show } = useContextMenu({ id: MENU_ID });

  const [week, setWeek] = useState(selectedWeek);
  const [year, setYear] = useState(null);
  const [gridEnabled, setGridEnabled] = useState(true);

  useEffect(() => {
    function handleResize() {
      setGridEnabled(window.matchMedia('screen and (min-width: 900px)').matches);
    }

    // Add event listener
    window.addEventListener('resize', handleResize);
    handleResize();

    console.log(gridEnabled);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isServer() && user) {
      if (localStorage.getItem('schedule/year') && localStorage.getItem('schedule/year') !== 'null')
        setYear(localStorage.getItem('schedule/year'));
      else setYear(user?.year);
    }
  }, [user]);

  function handleItemClick({ event, props, triggerEvent, data }){
    switch (event.currentTarget.id) {
      case "add":
        router.push('/schedule/edit');
        break;
      case "refresh":
        break;
      default:
        console.log('Affichage ->', event.currentTarget.id);
        setYear(event.currentTarget.id);
        localStorage.setItem('schedule/year', event.currentTarget.id);
        break;
    }
  }
  /*
  *  End of variable definitions
  */

  return <UserLayout user={user} title="Emploi du temps" flex={true} year={year} header={<>
      <Title appendGradient="temps" subtitle={`Semaine ${week} ${year && year !== user?.year ? '| 👥 ' + year : ''}`} button={<>
        <Menu id={MENU_ID}>
          <Item id="add" onClick={handleItemClick}>📝 Ajouter un cours (SWS)</Item>
          {user?.userType > 0 && <Item id="refresh" onClick={handleItemClick} disabled="true">🔄 Forcer l'actualisation</Item>}
          <Separator />
          <Submenu label="👥 Affichage">
            {user?.school && user?.degree && getSchoolYears(user).map(group => <Item id={group} key={group} onClick={handleItemClick}>{group === year ? '✅ ' : ''}{group}</Item>)}
          </Submenu>
        </Menu>
        <ButtonGroup>
          <FormButton disabled={selectedWeek === 0} onClick={() => setWeek(week - 1)}>{"«"}</FormButton>
          {[-1, 0, 1].map((e, i) => {
            return (<FormButton key={i} disabled={(selectedWeek + e) === week} onClick={() => setWeek(selectedWeek + e)}>{selectedWeek + e}</FormButton>);
          })}
          <FormButton disabled={selectedWeek === 52} onClick={() => setWeek(week + 1)}>{"»"}</FormButton>
          <FormButton is="action" icon={gridEnabled ? <HiViewGrid /> : <HiViewList />} onClick={e => setGridEnabled(!gridEnabled)}>{gridEnabled ? 'Grille' : 'Liste'}</FormButton>
          <FormButton is="action" icon={<HiDotsHorizontal />} onClick={e => show(e)}></FormButton>
        </ButtonGroup>
        </>}>
        Emploi du
      </Title>
    </>}>
      {user && year && <Schedule index={week} user={user} year={year} grid={gridEnabled} />}
    </UserLayout>;
};
