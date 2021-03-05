import React, { useRef } from 'react';

import styles from "./FormInput.module.css";
import FormGroup from "./FormGroup.js";

import { useFormContext } from 'react-hook-form';

export default function FormInput({ label, name, disableStyle, groupStyle = {}, disableLogic, type: enumType, ...rest }) {
  const type = enumType.toLowerCase();

  if (disableLogic) {
    if (disableStyle) return (
      <FormGroup label={label} name={name} disableStyle={true}>
        <input id={name} type={type} {...rest} />
      </FormGroup>
    );

    return (
      <FormGroup label={label} name={name} style={groupStyle}>
        <input className={styles.input} id={name} type={type} {...rest} />
      </FormGroup>
    );
  }

  const { register } = useFormContext();

  if (disableStyle) return (
    <FormGroup label={label} name={name} disableStyle={true}>
      <input ref={ref => register({ required: rest.required })} id={name} type={type} {...rest} />
    </FormGroup>
  );

  return (
    <FormGroup label={label} name={name} style={groupStyle}>
      <input className={styles.input} ref={ref => register({ required: rest.required })} id={name} type={type} {...rest} />
    </FormGroup>
  );
}
