import fetch from 'isomorphic-unfetch';
import useSWR from 'swr';

import { useContextMenu, Submenu, Menu, Item, Separator } from 'react-contexify';
import { useToasts } from 'react-toast-notifications';
import { useDarkMode } from 'next-dark-mode';

import { parseISO, lightFormat, addDays, getDay, getWeek, getHours, getMinutes } from 'date-fns';
import { getDateOfISOWeek } from '../lib/date';

import fetcher from '../lib/fetchJson';
import styles from "./Schedule.module.css";

const HOURS_MIN = 8, HOURS_MAX = 19, MENU_ID = "schedule-menu";

import "react-contexify/dist/ReactContexify.css";

function stringToColor(str = 'xxx') {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var colour = '#';
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xFF;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
}

function pickTextColorBasedOnBgColorAdvanced(bgColor, lightColor, darkColor) {
  let color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
  let r = parseInt(color.substring(0, 2), 16); // hexToR
  let g = parseInt(color.substring(2, 4), 16); // hexToG
  let b = parseInt(color.substring(4, 6), 16); // hexToB
  let uicolors = [r / 255, g / 255, b / 255];
  let c = uicolors.map((col) => {
    if (col <= 0.03928) {
      return col / 12.92;
    }
    return Math.pow((col + 0.055) / 1.055, 2.4);
  });
  let L = (0.2126 * c[0]) + (0.7152 * c[1]) + (0.0722 * c[2]);

  return (L > 0.179) ? darkColor : lightColor;
}

export default function Schedule({ user, index }) {
  /*
  * Variable definitions
  */
  const { data : schedule } = useSWR(`/api/schedule/by-week/${index}` + (user.userType == 0 && user?.group?.id ? '?filterByGroup=' + user?.group?.id : ''), fetcher);
  console.dir(schedule);

  const { darkModeActive } = useDarkMode();
  const { addToast } = useToasts();

  const { show } = useContextMenu({
    id: MENU_ID,
  });

  function displayMenu(e) {
    show(e, { props: { id: Number(e.currentTarget.id) } });
  }

  function handleItemClick({ event, props, data, triggerEvent }) {
    switch (event.currentTarget.id) {
      case "notify": {
          let title = window.prompt('Saisissez le titre de la notification', 'Rappel de cours');
          let body = window.prompt('Saisissez le corps de la notification', document.getElementById(props.id).children[1].innerText);

          fetcher(location.protocol + '//' + location.host + `/api/notifications/broadcast?title=${title}&body=${body}&interests=${document.querySelector('[interests]').getAttribute('interests')}`)
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

        fetcher(location.protocol + '//' + location.host + '/api/schedule/' + props.id, {
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

        fetcher(location.protocol + '//' + location.host + '/api/schedule/' + props.id, {
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

  return (
    <>
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

        {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'].map((x, i) => (
          <div className={styles.trackSlot} aria-hidden="true" style={{ gridColumn: 'track-' + (i + 1), gridRow: 'tracks' }}>
            <span>{x}</span>
            <small>{lightFormat(addDays(getDateOfISOWeek(index, new Date().getFullYear()), i), 'dd/MM')}</small>
          </div>
        ))}

        {schedule && schedule.map((x, i) =>
          <div id={x.id} key={i} onContextMenu={displayMenu} className={styles.session} meetingurl={x.meetingUrl} style={{ gridColumn: 'track-' + getDay(parseISO(x.start)), backgroundColor: '#' + x.subject.color || stringToColor(x.subject.name), color: pickTextColorBasedOnBgColorAdvanced(x.subject.color || stringToColor(x.subject.name), 'white', 'black'), gridRow: 'time-' + parseISO(x.start).toLocaleTimeString().slice(0,5).replace(':', '') + ' / time-' + parseISO(x.end).toLocaleTimeString().slice(0,5).replace(':', '') }}>
            <div className={styles.top} style={{ display: 'flex' }}>
              <b>{x.subject.module}</b>
              <span> - </span>
              <span>{parseISO(x.start).toLocaleTimeString().slice(0,5)} - {parseISO(x.end).toLocaleTimeString().slice(0,5)}</span>
            </div>

            <p className={styles.name}>{x.subject.name}</p>
            <p className={styles.teacher}>{x.teacher.firstName} {x.teacher.lastName}</p>

            <div className={styles.bottom}>
              <p>{x.room}</p>
              <p interests={x.groups.map(x => 'group-' + x.id).join(';')}>{x.groups.map(x => x.name).join(',\n')}</p>
              <p>{parseISO(x.start).toLocaleDateString()}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
