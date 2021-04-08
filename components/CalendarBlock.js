import styles from "./CalendarBlock.module.css";
import { parseISO, getDay } from 'date-fns';

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

export default function CalendarBlock({ start, end, summary, description, location }) {
  return <div
      className={styles.session}
      style={{
        gridColumn: "track-" + getDay(parseISO(start)),
        backgroundColor: stringToColor(summary),
        color: pickTextColorBasedOnBgColorAdvanced(
          stringToColor(summary),
          "white",
          "black"
        ),
        gridRow:
          "time-" + parseISO(start).toLocaleTimeString().slice(0, 5).replace(":", "") +
          " / time-" + parseISO(end).toLocaleTimeString().slice(0, 5).replace(":", "")
      }}
    >
      <div className={styles.top} style={{ display: "flex" }}>
        <span>
          {parseISO(start).toLocaleTimeString().slice(0, 5)} -{" "}
          {parseISO(end).toLocaleTimeString().slice(0, 5)}
        </span>
      </div>

      <p className={styles.name}>{summary}</p>
      <p className={styles.teacher}>
        {description}
      </p>

      <div className={styles.bottom}>
        <p>{location}</p>
        <p>{parseISO(start).toLocaleDateString()}</p>
      </div>
    </div>;
}
