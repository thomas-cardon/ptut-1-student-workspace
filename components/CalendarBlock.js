import {
  stringToColor,
  pickTextColorBasedOnBgColorAdvanced,
} from "../lib/colors";
import { parseISO, getDay } from "date-fns";

import styles from "./CalendarBlock.module.css";

import {
  useContextMenu,
  Submenu,
  Menu,
  Item,
  Separator,
} from "react-contexify";
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
                return <span key={i}><br />{word}</span>;

              return <span key={i}>{i === 0 ? '' : ' '}{word}</span>;
            })

  return words;
}

export default function CalendarBlock({ user, data }) {
  const { show } = useContextMenu({ id: data.id });

  function handleItemClick({ event, props, data, triggerEvent }) {
    switch (event.currentTarget.id) {
    }
  }

  return (
    <>
      <Menu id={data.id}>
        <Item id="connect" onClick={handleItemClick}>
          &#x1F4BB;&nbsp;&nbsp;Se connecter à la réunion
        </Item>
        <Separator />
        {user?.userType > 0 && (
          <Submenu label="Modération&nbsp;">
            <Item id="notify" onClick={handleItemClick}>
              🔔&nbsp;&nbsp;Notifier le groupe
            </Item>
            <Separator />
            <Item id="edit" onClick={handleItemClick}>
              &#x1F392;&nbsp;&nbsp;Modifier les données
            </Item>
          </Submenu>
        )}
      </Menu>
      <div
        onClick={() => confirm(`Vous allez rejoindre la réunion du cours: "${data.summary}"`)}
        onContextMenu={(event) => show(event, { props: {} })}
        className={styles.session}
        style={{
          gridColumn: "track-" + getDay(data.start),
          backgroundColor: stringToColor(data.summary),
          color: pickTextColorBasedOnBgColorAdvanced(
            stringToColor(data.summary),
            "white",
            "black"
          ),
          gridRow:
            "time-" +
            data.start.toLocaleTimeString().slice(0, 5).replace(":", "") +
            " / time-" +
            data.end.toLocaleTimeString().slice(0, 5).replace(":", ""),
        }}
      >
        <div className={styles.top} style={{ display: "flex" }}>
          <b>{data?.module}</b>
          {data?.module && <span>&nbsp;-&nbsp;</span>}
          <span>
            {data.start.toLocaleTimeString().slice(0, 5)} -{" "}
            {data.end.toLocaleTimeString().slice(0, 5)}
          </span>
        </div>

        <p className={styles.name}>
          {data?.subject || data.summary} {data?.type && `(${data?.type})`}
        </p>
        <p className={styles.teacher}>{bake(data.description)}</p>

        <div className={styles.bottom}>
          <p>{data.location}</p>
        </div>
      </div>
    </>
  );
}
