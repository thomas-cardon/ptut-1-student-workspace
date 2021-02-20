import React, { useState, useCallback, useEffect } from 'react';
import styles from "./Schedule.module.css";

import {
  Menu,
  Item,
  Separator,
  Submenu,
  useContextMenu
} from "react-contexify";

import "react-contexify/dist/ReactContexify.css";

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

function getLength(number) {
  return number.toString().length;
}

export default function Schedule({ classes, children }) {
  const { show } = useContextMenu({
    id: MENU_ID
  });

  function handleItemClick({ event, props, triggerEvent, data }){
    console.log(event, props, triggerEvent, data );
  }

  return (
    <>
      <Menu id={MENU_ID}>
        <Item disabled>&#x1F4DC; Voir le post attaché</Item>
        <Item disabled>&#x1F4BB; Se connecter (Zoom)</Item>
        <Separator />
        <Submenu label="Modération">
          <Item disabled>&#x1F589; Notifier le groupe</Item>
          <Separator />

          <Item disabled>&#x1F589; Modifier le professeur</Item>
          <Item disabled>&#x1F392; Modifier la salle</Item>
          <Item disabled>&#x1F4C6; Modifier la date</Item>
          <Separator />
          <Item disabled>&#x274C; Supprimer</Item>
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
        <span className={styles.timeSlot} style={{ gridRow: 'time-1330' }}>13:00</span>
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

        {classes.map((x, i) =>
          <div key={i} onClick={show} className={styles.session} meetingUrl={x.meetingUrl} style={{ gridColumn: 'track-' + x.day, backgroundColor: x.color || stringToColor(x.module), gridRow: 'time-' + x.start + ' / time-' + x.end }}>
            <span className={styles.hours}>{x.start.slice(0, 2)}:{x.start.slice(2)} - {x.end.slice(0, 2)}:{x.end.slice(2)}</span>
            <div>
              <p className={styles.module}>{x.module} {x.name}</p>
              <p className={styles.teacher}>{x.teacher}</p>
            </div>
            <p className={styles.room}>{x.room}</p>
          </div>
        )}
      </div>
    </>
  );
}
