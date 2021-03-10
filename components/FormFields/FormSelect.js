import FormGroup from "./FormGroup.js";

import styles from "./FormSelect.module.css";

export default function FormSelect({ label, options, noOption, name, ...rest }) {
  if (!options) return null;

  return (
    <FormGroup label={label} name={name}>
      <select className={styles.input} id={name} name={name} {...rest}>
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
