import styles from "./Form.module.css";

import { useForm, FormProvider } from "react-hook-form";
import * as Fields from "./FormFields";

export default function Form({ onSubmit, onError, fields, children }) {
  const { handleSubmit, ...methods } = useForm();

  if (!fields) return (
    <FormProvider {...methods}>
      <form className={styles.form} onSubmit={onSubmit} onError={onError}>
        {children}
      </form>
    </FormProvider>
  );

  return (
    <FormProvider {...methods}>
      <form className={styles.form} onSubmit={onSubmit} onError={onError}>
        {fields.map(({ __typename, ...field }, index) => {
          const Field = Fields[__typename];
          if (!Field) return null;
          return <Field key={index} {...field} />;
        })}
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
}
