import styles from "./FormRadio.module.css";

export default function FormRadio({ children, ...rest }) {
  return (
    <label className={styles.label}>
      <input type="radio" className={styles.input} {...rest} />
      <div className={styles.design} />
      <div className={styles.text}>{children}</div>
    </label>
  );
}
