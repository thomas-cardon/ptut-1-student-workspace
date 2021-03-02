import React from 'react';

import { useForm, FormProvider } from "react-hook-form";
import * as Fields from "./FormFields";

const Form = React.forwardRef(({ onSubmit, onError, fields, className = {}, style, children, reactHookForm = true }, ref) => {
  const { handleSubmit, ...methods } = useForm();

  return (
    <FormProvider {...methods}>
      <form ref={ref} className={className} style={style ? style : {}} onSubmit={onSubmit} onError={onError}>
        {children}
      </form>
    </FormProvider>
  );
});

export default Form;
