import styles from "./FormCheckbox.module.css";
import FormGroup from "./FormGroup.js";

export default function FormCheckbox({ label, inline, name, ...rest }) {
  return (
    <FormGroup label={label} name={name} inline={inline}>
      <input className={styles.checkbox} id={name} name={name} ref={register({ required: rest.required })} type="checkbox" {...rest} />
    </FormGroup>
  );
}
