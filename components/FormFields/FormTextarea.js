import FormGroup from "./FormGroup.js";

import { useFormContext } from 'react-hook-form';

export default function FormTextarea({ label, ...rest }) {
  const { register } = useFormContext();
  const { name } = rest;

  return (
    <FormGroup label={label} name={name}>
      <textarea ref={register({ required: rest.required })} id={name} {...rest} />
    </FormGroup>
  );
}
