import React, { useEffect, useState } from 'react';

import useSWR from 'swr';

import fetch from 'isomorphic-unfetch';
const fetcher = url => fetch(url).then(r => r.json());

import { useContextMenu, Submenu, Menu, Item, Separator } from 'react-contexify';
import { useToasts } from 'react-toast-notifications';

import { lightFormat, addDays, getISOWeek } from 'date-fns';
import { getDateOfISOWeek } from '../lib/date';
import { parseCalendarAsync } from '../lib/ade';

import Highlight from './Highlight';
import CalendarBlock from './CalendarBlock';

import styles from "./Schedule.module.css";

const HOURS_MIN = 8, HOURS_MAX = 19;

import "react-contexify/dist/ReactContexify.css";

const isServer = () => typeof window === `undefined`;

export default function Schedule({ grid, user, resource, settings, index }) {
  /*
  * Variable definitions
  */
  const { addToast } = useToasts();

  const [calendar, setCalendarData] = useState([]);
  const [events, setCalendarEvents] = useState([]);

  let update;

  if (!isServer()) {
    update = () => {
      parseCalendarAsync({ user, resource })
      .then(calendar => setCalendarData(
        calendar
        .map(x => {
          let event = events.find(y => x.id === y.uid);
          if (!event) return x;

          if (event.key === 'start' || event.key === 'end')
            event.value = new Date(event.value);

          return { ...x, [event.key] : event.value };
        })
        .filter(x => getISOWeek(x.start) === index)
        .filter(x => x.start.getHours() >= HOURS_MIN && x.end.getHours() >= HOURS_MIN && x.start.getHours() <= HOURS_MAX && x.end.getHours() <= HOURS_MAX)
        .filter(x => typeof x?.hidden === 'undefined' || x.hidden === 0)
      )).catch(console.error);
    }

    useEffect(update, [resource, index, events]);
  }

  useEffect(async () => {
    try {
      const r = await fetch(`${process.env.NEXT_PUBLIC_URL_PREFIX}/api/schedule/ade/events`);
      if (!r.ok) throw 'Response not OK';

      setCalendarEvents(await r.json());
    } catch (error) {
        console.error(error);
        addToast('Impossible de récupérer les évènements modifiés. Erreur fatale', { appearance: 'error' })
    }
  }, []);

  /*
  * End of variable definitions
  */

  return (<>
    {calendar.length === 0 && (
      <Highlight icon="🏫" title="Informations">
        Il n'y a pas de cours cette semaine.
      </Highlight>
    )}

    <div className={[styles.schedule, grid ? styles.grid : styles.list].join(' ')}>
      <span className={styles.timeSlot} style={{ gridRow: 'time-0800' }}>8:00</span>
      <span className={styles.timeSlot} style={{ gridRow: 'time-0830' }}>8:30</span>
      <span className={styles.timeSlot} style={{ gridRow: 'time-0900' }}>9:00</span>
      <span className={styles.timeSlot} style={{ gridRow: 'time-0930' }}>9:30</span>
      <span className={styles.timeSlot} style={{ gridRow: 'time-1000' }}>10:00</span>
      <span className={styles.timeSlot} style={{ gridRow: 'time-1030' }}>10:30</span>
      <span className={styles.timeSlot} style={{ gridRow: 'time-1100' }}>11:00</span>
      <span className={styles.timeSlot} style={{ gridRow: 'time-1130' }}>11:30</span>
      <span className={styles.timeSlot} style={{ gridRow: 'time-1200' }}>12:00</span>
      <span className={styles.timeSlot} style={{ gridRow: 'time-1230' }}>12:30</span>
      <span className={styles.timeSlot} style={{ gridRow: 'time-1300' }}>13:00</span>
      <span className={styles.timeSlot} style={{ gridRow: 'time-1330' }}>13:30</span>
      <span className={styles.timeSlot} style={{ gridRow: 'time-1400' }}>14:00</span>
      <span className={styles.timeSlot} style={{ gridRow: 'time-1430' }}>14:30</span>
      <span className={styles.timeSlot} style={{ gridRow: 'time-1500' }}>15:00</span>
      <span className={styles.timeSlot} style={{ gridRow: 'time-1530' }}>15:30</span>
      <span className={styles.timeSlot} style={{ gridRow: 'time-1600' }}>16:00</span>
      <span className={styles.timeSlot} style={{ gridRow: 'time-1630' }}>16:30</span>
      <span className={styles.timeSlot} style={{ gridRow: 'time-1700' }}>17:00</span>
      <span className={styles.timeSlot} style={{ gridRow: 'time-1730' }}>17:30</span>
      <span className={styles.timeSlot} style={{ gridRow: 'time-1800' }}>18:00</span>
      <span className={styles.timeSlot} style={{ gridRow: 'time-1830' }}>18:30</span>
      <span className={styles.timeSlot} style={{ gridRow: 'time-1900' }}>19:00</span>

      {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
      .map((x, i) => <div key={'day-' + i} className={styles.trackSlot} aria-hidden="true" style={{ gridColumn: 'track-' + (i + 1), gridRow: 'tracks' }}>
        <span>{x}</span>
        <small>{lightFormat(addDays(getDateOfISOWeek(index, new Date().getFullYear()), i), 'dd/MM')}</small>
      </div>)}

      {calendar.map((x, i) => <CalendarBlock key={x.id} user={user} resource={resource} data={x} settings={settings} />)}
    </div>
    </>);
}
