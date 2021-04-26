import { stringToColor, pickTextColorBasedOnBgColorAdvanced } from '../lib/colors';
import { parseISO, getDay } from 'date-fns';

import styles from "./ScheduleBlock.module.css";

export default function ScheduleBlock({ data, onContextMenu }) {
  return <div
      id={data.id}
      className={styles.session}
      meetingurl={data.meetingUrl}
      onContextMenu={onContextMenu}
      onClick={() => confirm(`Vous allez rejoindre la réunion du cours: ${data.subject.name}`)}
      style={{
        gridColumn: "track-" + getDay(parseISO(data.start)),
        backgroundColor: data.subject.color || stringToColor(data.subject.name),
        color: pickTextColorBasedOnBgColorAdvanced(
          data.subject.color || stringToColor(data.subject.name),
          "white",
          "black"
        ),
        gridRow:
          "time-" + parseISO(data.start).toLocaleTimeString().slice(0, 5).replace(":", "") +
          " / time-" + parseISO(data.end).toLocaleTimeString().slice(0, 5).replace(":", "")
      }}
    >
      <div className={styles.top} style={{ display: "flex" }}>
        <b>{data.subject.module}</b>
        <span> - </span>
        <span>
          {parseISO(data.start).toLocaleTimeString().slice(0, 5)} -{" "}
          {parseISO(data.end).toLocaleTimeString().slice(0, 5)}
        </span>
      </div>

      <p className={styles.name}>{data.subject.name}</p>
      <p className={styles.teacher}>
        {data.teacher.firstName} {data.teacher.lastName}
      </p>

      <div className={styles.bottom}>
        <p>{data.room || <i>Aucune salle</i>}</p>
        <p interests={data.groups.map((x) => "group-" + data.id).join(";")}>
          {data.groups.map(x => x.name).join(",\n")}
        </p>
        <p>{parseISO(data.start).toLocaleDateString()}</p>
      </div>
    </div>;
}
