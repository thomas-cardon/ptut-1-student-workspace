import React from 'react';

import { useForm, FormProvider } from "react-hook-form";
import * as Fields from "./FormFields";

import styles from "./Form.module.css";

const Form = React.forwardRef(({ onSubmit, onError, fields, children, reactHookForm = true }, ref) => {
  const { handleSubmit, ...methods } = useForm();

  return (
    <FormProvider {...methods}>
      <form ref={ref} className={styles.form} onSubmit={onSubmit} onError={onError}>
        {children}
      </form>
    </FormProvider>
  );
});

export default Form;
