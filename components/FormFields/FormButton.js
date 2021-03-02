import styles from "./FormButton.module.css";
import FormGroup from "./FormGroup";

export default function FormButton({ disableStyle = false, ...rest }) {
  return (
    <FormGroup disableStyle={disableStyle}>
      <button className={styles.button} {...rest} />
    </FormGroup>
  );
}
