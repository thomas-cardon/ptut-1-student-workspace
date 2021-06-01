import styles from "./FormSwitch.module.css";
import FormGroup from "./FormGroup.js";

export default function FormSwitch({ label, inline, name, ...rest }) {
  return (<div className={styles.group}>
    <p>{label}</p>
    <label className={styles.switch}>
      <input id={name} name={name} type="checkbox" {...rest} />
      <span className={[styles.slider, styles.round].join(' ')}></span>
    </label>
  </div>);
}
