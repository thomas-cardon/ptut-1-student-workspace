import FormGroup from "./FormGroup.js";

import styles from "./FormSelect.module.css";
import { useFormContext } from 'react-hook-form';

export default function FormSelect({ label, options, noOption, ...rest }) {
  const { register } = useFormContext();

  const { name } = rest;
  if (!options) return null;

  return (
    <FormGroup label={label} name={name}>
      <select className={styles.input} ref={register({ required: rest.required })} id={name} {...rest}>
        {noOption && (
          <option value="">{noOption}</option>
        )}
        {options.map(({ option, ...opt }, index) => (
          <option key={index} {...opt}>
            {option}
          </option>
        ))}
      </select>
    </FormGroup>
  );
}
