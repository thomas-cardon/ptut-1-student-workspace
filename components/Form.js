import styles from "./Form.module.css";

import { useForm, FormProvider } from "react-hook-form";
import * as Fields from "./FormFields";

export default function Form({ onSubmit, fields, children }) {
  const { handleSubmit, ...methods } = useForm();

  if (!fields) return (
    <FormProvider {...methods}>
      <form className={styles.form} onSubmit={onSubmit}>
        {children}
      </form>
    </FormProvider>
  );

  return (
    <FormProvider {...methods}>
      <form className={styles.form} onSubmit={onSubmit}>
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
