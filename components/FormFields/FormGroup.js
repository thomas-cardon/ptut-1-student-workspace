import styles from "./FormGroup.module.css";

export default function FormGroup({ label, name, inline, style = {}, disableStyle, children }) {
  if (disableStyle) return (
    <div>
      {label && (<label htmlFor={name}>
        {label}
      </label>)}
      {children}
    </div>
  );

  return (
    <div className={[styles.formGroup, inline ? styles.inline : ''].join(' ')} style={style}>
      {label && (<label htmlFor={name} style={{ marginRight: '1em', fontWeight: 'bold' }}>
        {label}
      </label>)}
      {children}
    </div>
  );
}
