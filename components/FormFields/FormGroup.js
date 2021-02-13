import styles from "./FormGroup.module.css";

export default function FormGroup({ label, name, children }) {
  return (
    <div className={styles.formGroup}>
      {label && (<label htmlFor={name} style={{ marginRight: '1em', fontWeight: 'bold' }}>
        {label}
      </label>)}
      {children}
    </div>
  );
}
