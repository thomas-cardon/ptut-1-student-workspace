import FormGroup from "./FormGroup.js";

import styles from "./FormSelect.module.css";

export default function FormInput({ label, name, icon, options, noOption, groupStyle, ...rest }) {
  if (!options) return null;

  return (
    <FormGroup label={label} name={name} style={groupStyle}>
      <div className={styles['input-container']}>
        {icon && (
          <div className={styles.icon}>
            {icon}
          </div>
        )}
        <select id={name} name={name} {...rest} >
          {noOption && (
            <option value="">{noOption}</option>
          )}
          {options.map(({ option, ...opt }, index) => (
            <option key={index} {...opt}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </FormGroup>
  );
}
