import styles from "./FormCheckboxList.module.css";
import FormGroup from "./FormGroup.js";

export default function FormCheckboxList({ label, options, ...rest }) {
  return (<div className={styles.list}>
    <h3>{label}</h3>
    {options.map((x, i) => (<div key={i}>
      <input className={styles.checkbox} {...rest} id={'checkbox-' + (x.id || x.value)} data-id={x.id || x.value} data-label={x.label} type="checkbox" />
      <label htmlFor={'checkbox-' + (x.id || x.value)}>{x.label}</label>
    </div>))}
  </div>);
}
