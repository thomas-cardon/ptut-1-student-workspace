import { stringToColor, pickTextColorBasedOnBgColorAdvanced } from '../lib/colors';
import { parseISO, getDay } from 'date-fns';

import styles from "./CalendarBlock.module.css";

import { useContextMenu, Submenu, Menu, Item, Separator } from 'react-contexify';
import "react-contexify/dist/ReactContexify.css";

/**
 * Permet de transformer une description iCalendar en données utilisables
 * @param  {string} description
 * @return {[string[]]} [Les éléments à afficher dans le bloc]
 */
function bake(description) {
  let words = description
            .match(/^[^\(]+/)[0]
            .replace(/(\r\n|\n|\r)/gm, " ")
            .trim().split(' ')
            .filter(word => word.length > 3 && !word.includes('Groupe'))
            .map((word, i, arr) => {
              if (word === word.toUpperCase() && arr[i - 1] && arr[i - 1] !== arr[i - 1].toUpperCase())
                return <span><br />{word}</span>;

              return <span>{i === 0 ? '' : ' '}{word}</span>;
            })

  return words;
}

/**
* Permet de transformer une description iCalendar en données utilisables
* @param  {string} description
* @return {[string[]]} [Les éléments à afficher dans le bloc]
 */
function bakeSummary(summary) {
  let matches = summary.match(/^(M[0-9]{4}) (.*?) (TD|TP)/);
  return matches ? { module: matches[1], subject: matches[2], type: matches[3] } : summary;
}

export default function CalendarBlock({ user, start, end, summary, description, location }) {
  summary = bakeSummary(summary);
  let subject = summary?.subject || summary;

  const id = `${start}-${encodeURIComponent(summary)}-${user.group.id}`;
  const { show } = useContextMenu({ id });

  function handleItemClick({ event, props, data, triggerEvent }) {
    switch (event.currentTarget.id) {}
  }

  console.log(id);

  return <>
    <Menu id={id}>
      <Item id="connect" onClick={handleItemClick}>&#x1F4BB;&nbsp;&nbsp;Se connecter à la réunion</Item>
      <Separator />
      {user.userType > 0 && (
        <Submenu label="Modération">
          <Item id="notify" onClick={handleItemClick}>🔔&nbsp;&nbsp;Notifier le groupe</Item>
          <Separator />
          <Item id="edit" onClick={handleItemClick}>&#x1F392;&nbsp;&nbsp;Modifier les données</Item>
        </Submenu>
      )}
    </Menu>
    <div
      onContextMenu={event => show(event, { props: {} })}
      className={styles.session}
      style={{
        gridColumn: "track-" + getDay(parseISO(start)),
        backgroundColor: stringToColor(subject),
        color: pickTextColorBasedOnBgColorAdvanced(
          stringToColor(subject),
          "white",
          "black"
        ),
        gridRow:
          "time-" + parseISO(start).toLocaleTimeString().slice(0, 5).replace(":", "") +
          " / time-" + parseISO(end).toLocaleTimeString().slice(0, 5).replace(":", "")
      }}
    >

      <div className={styles.top} style={{ display: "flex" }}>
        <b>{summary?.module}</b>
        {summary?.module && <span> - </span>}
        <span>
          {parseISO(start).toLocaleTimeString().slice(0, 5)} -{" "}
          {parseISO(end).toLocaleTimeString().slice(0, 5)}
        </span>
      </div>

      <p className={styles.name}>{subject} {summary.type && `(${summary.type})`}</p>
      <p className={styles.teacher}>
        {bake(description)}
      </p>

      <div className={styles.bottom}>
        <p>{location}</p>
      </div>
    </div>
  </>;
}
