import styles from "./FormButton.module.css";
import FormGroup from "./FormGroup";

export default function FormButton({ disableStyle, ...rest }) {
  if (disableStyle) return (
    <FormGroup disableStyle={true}>
      <button {...rest} />
    </FormGroup>
  );

  return (
    <FormGroup>
      <button className={styles.button} {...rest} />
    </FormGroup>
  );
}
