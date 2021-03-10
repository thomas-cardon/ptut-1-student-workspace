import React, { useState, useCallback, useEffect } from 'react';
import { useToasts } from 'react-toast-notifications';

import { useContextMenu, Submenu, Menu, Item, Separator } from "react-contexify";
import "react-contexify/dist/ReactContexify.css";

import fetcher from '../lib/fetchJson';
import styles from "./Schedule.module.css";

const MENU_ID = "schedule-menu";

function stringToColor(str) {
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

export default function Schedule({ data, children }) {
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

          fetcher(location.protocol + '//' + location.host + `/api/notifications/broadcast?title=${title}&body=${body}&interests=group-${document.getElementById(props.id).lastChild.getAttribute('groupid')}`)
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
        alert('Meeting URL edit WIP');
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
          <Item disabled={true} id="edit-date" onClick={handleItemClick}>&#x1F4C6;&nbsp;&nbsp;Modifier la date</Item>
          <Separator />
          <Item id="remove" onClick={handleItemClick}>&#x274C;&nbsp;&nbsp;Supprimer</Item>
        </Submenu>
      </Menu>

      <div className={styles.schedule}>
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

        <span className={styles.trackSlot} aria-hidden="true" style={{ gridColumn: 'track-1', gridRow: 'tracks' }}>Lundi</span>
        <span className={styles.trackSlot} aria-hidden="true" style={{ gridColumn: 'track-2', gridRow: 'tracks' }}>Mardi</span>
        <span className={styles.trackSlot} aria-hidden="true" style={{ gridColumn: 'track-3', gridRow: 'tracks' }}>Mercredi</span>
        <span className={styles.trackSlot} aria-hidden="true" style={{ gridColumn: 'track-4', gridRow: 'tracks' }}>Jeudi</span>
        <span className={styles.trackSlot} aria-hidden="true" style={{ gridColumn: 'track-5', gridRow: 'tracks' }}>Vendredi</span>
        <span className={styles.trackSlot} aria-hidden="true" style={{ gridColumn: 'track-6', gridRow: 'tracks' }}>Samedi</span>

        {data.map((x, i) =>
          <div id={x.id} key={i} onContextMenu={displayMenu} className={styles.session} meetingurl={x.meetingUrl} style={{ gridColumn: 'track-' + x.day, backgroundColor: x.color || stringToColor(x.name), color: pickTextColorBasedOnBgColorAdvanced(x.color || stringToColor(x.name), 'white', 'black'), gridRow: 'time-' + x.start + ' / time-' + x.end }}>
            <span className={styles.hours}><b>{x.module}</b> - {x.start.slice(0, 2)}:{x.start.slice(2)} - {x.end.slice(0, 2)}:{x.end.slice(2)}</span>
            <p className={styles.name}>{x.name}</p>
            <p className={styles.teacher}>{x.teacher}</p>
            <p className={styles.room}>{x.room}</p>
            <p className={styles.room} style={{ margin: '0 0 0 5%' }} groupid={x.groupId}>{x.groupName}</p>
          </div>
        )}
      </div>
    </>
  );
}
