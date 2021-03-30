import React, { useRef } from 'react';

import styles from "./FormInput.module.css";
import FormGroup from "./FormGroup.js";

export default function FormInput({ label, name, icon, type: enumType, groupStyle, disableStyle, ...rest }) {
  const type = enumType.toLowerCase();

  if (disableStyle) {
    return (
      <FormGroup label={label} name={name}>
        <div>
          <input id={name} name={name} type={type} {...rest} />
        </div>
      </FormGroup>);
  }

  return (
    <FormGroup label={label} name={name} style={groupStyle}>
      <div className={styles['input-container']}>
        {icon && (
          <div className={styles.icon}>
            {icon}
          </div>
        )}
        <input id={name} name={name} type={type} {...rest} />
      </div>
    </FormGroup>
  );
}
