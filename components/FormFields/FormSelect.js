import FormGroup from "./FormGroup.js";

import { useFormContext } from 'react-hook-form';

export default function FormSelect({ label, options, ...rest }) {
  const { register } = useFormContext();

  const { name } = rest;
  if (!options) return null;

  return (
    <FormGroup label={label} name={name}>
      <select ref={register({ required: rest.required })} id={name} {...rest}>
        {options.map(({ option, ...opt }, index) => (
          <option key={index} {...opt}>
            {option}
          </option>
        ))}
      </select>
    </FormGroup>
  );
}
