import useSWR from 'swr';
import fetch from 'isomorphic-unfetch';
const fetcher = url => fetch(url).then(r => r.json());

import { useContextMenu, Submenu, Menu, Item, Separator } from 'react-contexify';
import { useToasts } from 'react-toast-notifications';
import { useDarkMode } from 'next-dark-mode';

import { lightFormat, addDays } from 'date-fns';
import { getDateOfISOWeek } from '../lib/date';

import ScheduleBlock from './ScheduleBlock';
import styles from "./Schedule.module.css";

const HOURS_MIN = 8, HOURS_MAX = 19, MENU_ID = "schedule-menu";

import "react-contexify/dist/ReactContexify.css";

export default function Schedule({ user, index }) {
  /*
  * Variable definitions
  */
  const { data : schedule } = useSWR(`/api/schedule/by-week/${index}` + (user.userType == 0 && user?.group?.id ? '?filterByGroup=' + user?.group?.id : ''), fetcher);

  const { darkModeActive } = useDarkMode();
  const { addToast } = useToasts();

  const { show } = useContextMenu({ id: MENU_ID });

  function handleItemClick({ event, props, data, triggerEvent }) {
    switch (event.currentTarget.id) {
      case "notify": {
          let title = window.prompt('Saisissez le titre de la notification', 'Rappel de cours');
          let body = window.prompt('Saisissez le corps de la notification', document.getElementById(props.id).children[1].innerText);

          fetch(location.protocol + '//' + location.host + `/api/notifications/broadcast?title=${title}&body=${body}&interests=${document.querySelector('[interests]').getAttribute('interests')}`)
          .then(() => addToast('Tous les utilisateurs concernés ont été notifiés.', { appearance: 'success' }))
          .catch(err => {
            addToast("Une erreur s'est produite.", { appearance: 'error' });
            console.error(err);
          });

          break;
      }
      case "connect": {
        if (!document.getElementById(event.currentTarget.id).getAttribute('meetingurl')) alert("Aucune réunion n'est encore disponible pour ce cours.");
        else window.open(document.getElementById(event.currentTarget.id).getAttribute('meetingurl'), '_blank').focus();
        break;
      }
      case "edit-room": {
        let room = window.prompt('Saisissez le nom de la nouvelle salle', document.getElementById(props.id).children[3].innerText);

        fetch(location.protocol + '//' + location.host + '/api/schedule/' + props.id, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ room })
         })
        .then(() => addToast(`Modification réussie du cours #${props.id}`, { appearance: 'success' }))
        .catch(err => {
          addToast("Une erreur s'est produite.", { appearance: 'error' });
          console.error(err);
        });

        break;
      }
      case "edit-meeting-url": {
        let meetingUrl = window.prompt('Saisissez le lien de la réunion (Google Meet, Zoom, jit.si...)');

        fetch(location.protocol + '//' + location.host + '/api/schedule/' + props.id, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ meetingUrl })
         })
        .then(() => addToast(`Modification réussie du cours #${props.id}`, { appearance: 'success' }))
        .catch(err => {
          addToast("Une erreur s'est produite.", { appearance: 'error' });
          console.error(err);
        });

        break;
      }
      case "remove": {
        if (!confirm('Voulez-vous vraiment supprimer ce cours?'))
          return;

        fetcher(location.protocol + '//' + location.host + '/api/schedule/' + props.id, { method: 'DELETE' })
        .then(() => addToast(`Suppression réussie du cours  #${props.id}`, { appearance: 'success' }))
        .catch(err => {
          addToast("Une erreur s'est produite.", { appearance: 'error' });
          console.error(err);
        });
        break;
      }
    }
  }

  /*
  * End of variable definitions
  */

  return (<>
    <Menu id={MENU_ID}>
      <Item id="view" onClick={handleItemClick}>&#x1F4DC;&nbsp;&nbsp;Voir le post attaché</Item>
      <Item id="connect" onClick={handleItemClick}>&#x1F4BB;&nbsp;&nbsp;Se connecter à la réunion</Item>
      <Separator />
      <Submenu label="Modération">
        <Item id="notify" onClick={handleItemClick}>🔔&nbsp;&nbsp;Notifier le groupe</Item>
        <Separator />

        <Item id="edit-room" onClick={handleItemClick}>&#x1F392;&nbsp;&nbsp;Modifier la salle</Item>
        <Item disabled={true} id="edit-meeting-url" onClick={handleItemClick}>&#x1F4BB;&nbsp;&nbsp;Modifier la réunion</Item>
        <Separator />
        <Item id="remove" onClick={handleItemClick}>&#x274C;&nbsp;&nbsp;Supprimer</Item>
      </Submenu>
    </Menu>

    <div className={[styles.schedule, darkModeActive ? styles.dark : ''].join(' ')}>
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

      {schedule && schedule.map((x, i) => <ScheduleBlock data={x} key={i} onContextMenu={event => show(event, { props: { id: x.id } })} />)}
    </div>
    </>);
}
