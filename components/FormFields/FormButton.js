import styles from "./FormButton.module.css";
import FormGroup from "./FormGroup";

export default function FormButton({ ...rest }) {
  return (
    <FormGroup>
      <button className={styles.button} {...rest} />
    </FormGroup>
  );
}
