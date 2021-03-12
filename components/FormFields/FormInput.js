import React, { useRef } from 'react';

import styles from "./FormInput.module.css";
import FormGroup from "./FormGroup.js";

export default function FormInput({ label, name, disableStyle, groupStyle = {}, disableLogic, type: enumType, ...rest }) {
  const type = enumType.toLowerCase();

  if (disableStyle) return (
    <FormGroup label={label} name={name} disableStyle={true}>
      <input id={name} name={name} type={type} {...rest} />
    </FormGroup>
  );

  return (
    <FormGroup label={label} name={name} style={groupStyle}>
      <input className={styles.input} id={name} name={name} type={type} {...rest} />
    </FormGroup>
  );
}
