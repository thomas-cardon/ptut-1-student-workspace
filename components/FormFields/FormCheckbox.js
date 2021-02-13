import styles from "./FormCheckbox.module.css";
import FormGroup from "./FormGroup.js";

import { useFormContext } from 'react-hook-form';

export default function FormCheckbox({ label, ...rest }) {
  const { register } = useFormContext();
  const { name } = rest;

  return (
    <FormGroup label={label} name={name}>
      <input className={styles.checkbox} ref={register({ required: rest.required })} id={name} type="checkbox" {...rest} />
    </FormGroup>
  );
}
