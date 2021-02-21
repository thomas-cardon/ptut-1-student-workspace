import React, { useRef } from 'react';

import styles from "./FormInput.module.css";
import FormGroup from "./FormGroup.js";

import { useFormContext } from 'react-hook-form';

export default function FormInput({ label, disableStyle, type: enumType, ...rest }) {
  const { register } = useFormContext();

  const { name } = rest;
  const type = enumType.toLowerCase();

  if (disableStyle) return (
    <FormGroup label={label} name={name} disableStyle={true}>
      <input ref={ref => register({ required: rest.required })} id={name} type={type} {...rest} />
    </FormGroup>
  );

  return (
    <FormGroup label={label} name={name}>
      <input className={styles.input} ref={ref => register({ required: rest.required })} id={name} type={type} {...rest} />
    </FormGroup>
  );
}
