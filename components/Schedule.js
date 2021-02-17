import React, { useState, useCallback, useEffect } from 'react';
import styles from "./Schedule.module.css";

const useContextMenu = () => {
  const [xPos, setXPos] = useState("0px");
  const [yPos, setYPos] = useState("0px");
  const [showMenu, setShowMenu] = useState(false);

  const handleContextMenu = useCallback(
    (e) => {
      e.preventDefault();
      console.log(`${e.pageX}px`, `${e.pageY}px`)

      setXPos(`${e.pageX}px`);
      setYPos(`${e.pageY}px`);
      setShowMenu(true);
    },
    [setXPos, setYPos]
  );

  const handleClick = useCallback(() => {
    showMenu && setShowMenu(false);
  }, [showMenu]);

  useEffect(() => {
    document.addEventListener("click", handleClick);
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.addEventListener("click", handleClick);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  });

  return { xPos, yPos, showMenu };
};

export default function Schedule({ classes, children }) {
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

  useContextMenu();

  return (
    <div className={styles.schedule}>
      <h2 className={styles.timeSlot} style={{ gridRow: 'time-0800' }}>8:00</h2>
      <h2 className={styles.timeSlot} style={{ gridRow: 'time-0830' }}>8:30</h2>
      <h2 className={styles.timeSlot} style={{ gridRow: 'time-0900' }}>9:00</h2>
      <h2 className={styles.timeSlot} style={{ gridRow: 'time-1000' }}>10:00</h2>
      <h2 className={styles.timeSlot} style={{ gridRow: 'time-1030' }}>10:30</h2>
      <h2 className={styles.timeSlot} style={{ gridRow: 'time-1100' }}>11:00</h2>
      <h2 className={styles.timeSlot} style={{ gridRow: 'time-1130' }}>11:30</h2>
      <h2 className={styles.timeSlot} style={{ gridRow: 'time-1200' }}>12:00</h2>
      <h2 className={styles.timeSlot} style={{ gridRow: 'time-1230' }}>12:30</h2>
      <h2 className={styles.timeSlot} style={{ gridRow: 'time-1300' }}>13:00</h2>
      <h2 className={styles.timeSlot} style={{ gridRow: 'time-1330' }}>13:00</h2>
      <h2 className={styles.timeSlot} style={{ gridRow: 'time-1400' }}>14:00</h2>
      <h2 className={styles.timeSlot} style={{ gridRow: 'time-1430' }}>14:30</h2>
      <h2 className={styles.timeSlot} style={{ gridRow: 'time-1500' }}>15:00</h2>
      <h2 className={styles.timeSlot} style={{ gridRow: 'time-1530' }}>15:30</h2>
      <h2 className={styles.timeSlot} style={{ gridRow: 'time-1600' }}>16:00</h2>
      <h2 className={styles.timeSlot} style={{ gridRow: 'time-1630' }}>16:30</h2>
      <h2 className={styles.timeSlot} style={{ gridRow: 'time-1700' }}>17:00</h2>
      <h2 className={styles.timeSlot} style={{ gridRow: 'time-1730' }}>17:30</h2>

      <span className={styles.trackSlot} aria-hidden="true" style={{ gridColumn: 'track-1', gridRow: 'tracks' }}>Lundi</span>
      <span className={styles.trackSlot} aria-hidden="true" style={{ gridColumn: 'track-2', gridRow: 'tracks' }}>Mardi</span>
      <span className={styles.trackSlot} aria-hidden="true" style={{ gridColumn: 'track-3', gridRow: 'tracks' }}>Mercredi</span>
      <span className={styles.trackSlot} aria-hidden="true" style={{ gridColumn: 'track-4', gridRow: 'tracks' }}>Jeudi</span>
      <span className={styles.trackSlot} aria-hidden="true" style={{ gridColumn: 'track-5', gridRow: 'tracks' }}>Vendredi</span>
      <span className={styles.trackSlot} aria-hidden="true" style={{ gridColumn: 'track-6', gridRow: 'tracks' }}>Samedi</span>
      <span className={styles.trackSlot} aria-hidden="true" style={{ gridColumn: 'track-7', gridRow: 'tracks' }}>Dimanche</span>

      {classes.map((x, i) =>
        <div key={i} className={styles.session} style={{ gridColumn: 'track-' + x.day, backgroundColor: stringToColor(x.module), gridRow: 'time-' + (getLength(x.start) == 1 ? '0' + x.start : x.start) + '00 / time-' + (getLength(x.end) == 1 ? '0' + x.end : x.end) + '00' }}>
          <span className={styles.hours}>{x.start}:00 - {x.end}:00</span>
          <p className={styles.module}>{x.module}</p>
          <p className={styles.teacher}>{x.teacher}</p>
          <p className={styles.room}>{x.room}</p>
        </div>
      )}
    </div>
  );
}
