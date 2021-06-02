import React, { useState, useEffect } from 'react';
import useSWR from 'swr';

import Loader from 'react-loader-spinner';
import dynamic from 'next/dynamic';

import useUser from '../../lib/useUser';
import { fetcher } from '../../lib/hooks';

import { getISOWeek } from 'date-fns';

import Title from '../../components/Title';
import Link from '../../components/Link';

import UserLayout from '../../components/UserLayout';
import GroupList from '../../components/GroupList';

import { ButtonGroup, FormButton } from '../../components/FormFields';

import { HiCog, HiDotsHorizontal, HiViewGrid, HiViewList } from "react-icons/hi";

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
  const { data : groups, groupsError } = useSWR('/api/groups/by-user', fetcher); // api/users/teachers/resources
  const { data : teachers, resourcesError } = useSWR('/api/users/teachers/resources', fetcher);

  const [week, setWeek] = useState(selectedWeek);
  const [resource, setResource] = useState(null);

  const [gridEnabled, setGridEnabled] = useState(true);
  const [settings, setSettings] = useState({ showModule: false, showTeachers: false });

  const { show } = useContextMenu({ id: MENU_ID });

  useEffect(() => {
    function handleResize() {
      setGridEnabled(window.matchMedia('screen and (min-width: 900px)').matches);
    }

    // Add event listener
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isServer() || !user) return;

    if (localStorage.getItem(`schedule/${user.userId}/resource`) != null)
      setResource(localStorage.getItem(`schedule/${user.userId}/resource`));
  }, [user]);

  useEffect(() => {
    if (isServer()) return;

    if (localStorage.getItem(`schedule/settings`))
      setSettings(JSON.parse(localStorage.getItem(`schedule/settings`)));
  }, []);

  useEffect(() => localStorage.setItem(`schedule/settings`, JSON.stringify(settings)), [settings]);


  function handleItemClick({ event, props, triggerEvent, data }){
    switch (event.currentTarget.id) {
      case "add":
        router.push('/schedule/edit');
        break;
      case "refresh":
        fetch('/api/schedule/ade/refresh').then(res => {
          if (res.ok) {
            sessionStorage.clear();
            location.reload();
          }
        }).catch(console.error);
        break;
      case "toggle-module":
        setSettings({ ...settings, showModule: !settings.showModule });
        break;
        break;
      case "toggle-teachers":
        setSettings({ ...settings, showTeachers: !settings.showTeachers });
        break;
      default:
        if (!event.currentTarget.id) return;

        console.log('Affichage -> Définition ressource:', event.currentTarget.id);
        setResource(event.currentTarget.id);
        localStorage.setItem(`schedule/${user.userId}/resource`, event.currentTarget.id);
        break;
    }
  }
  /*
  *  End of variable definitions
  */

  return <UserLayout user={user} title="Emploi du temps" flex={true} header={<>
      <Title appendGradient="temps" subtitle={`Semaine ${week}`} button={<>
        <Menu id={MENU_ID}>
          <Item id="toggle-module" onClick={handleItemClick}>{settings.showModule ? 'Cacher' : 'Afficher'} les modules</Item>
          <Item id="toggle-teachers" onClick={handleItemClick}>{settings.showTeachers ? 'Cacher' : 'Afficher'} les professeurs</Item>
          <Separator />
          {(user?.userType > 0 || user?.delegate) && (<>
            <Item id="refresh" onClick={handleItemClick}>🔄 Forcer l'actualisation</Item>
            <Separator />
          </>)}
          <Submenu label="👥 Affichage">
            <Item id={user?.schedule.resourceId} onClick={handleItemClick}>Par défaut (#{user?.schedule.resourceId})</Item>
            <Separator />
            {user?.school && !groupsError && groups?.map(g => <Item id={g.resourceId} key={g.resourceId} onClick={handleItemClick}>{g.resourceId === resource ? '✅ ' : ''}{g.name}</Item>)}
            <Separator />
            {!resourcesError && teachers?.map(t => <Item id={t.resourceId} key={"t-" + t.resourceId} onClick={handleItemClick}>{t.resourceId === resource ? '✅ ' : ''}{t.firstName} {t.lastName}</Item>)}
          </Submenu>
        </Menu>
        <ButtonGroup>
          <FormButton disabled={selectedWeek === 0} onClick={() => setWeek(week - 1)}>{"«"}</FormButton>
          {[-1, 0, 1].map((e, i) => {
            return (<FormButton key={i} disabled={(selectedWeek + e) === week} onClick={() => setWeek(selectedWeek + e)}>{selectedWeek + e}</FormButton>);
          })}
          <FormButton disabled={selectedWeek === 52} onClick={() => setWeek(week + 1)}>{"»"}</FormButton>
          <FormButton icon={<HiCog />} onClick={e => show(e)}></FormButton>
          <FormButton is="action" icon={gridEnabled ? <HiViewGrid /> : <HiViewList />} onClick={e => setGridEnabled(!gridEnabled)}>{gridEnabled ? 'Grille' : 'Liste'}</FormButton>
        </ButtonGroup>
        </>}>
        Emploi du
      </Title>
    </>}>
      {user && <Schedule index={week} user={user} resource={resource} settings={settings} grid={gridEnabled} />}
    </UserLayout>;
};
