import styles from "./FormButton.module.css";
import FormGroup from "./FormGroup";

export default function FormButton({ is, children, icon, ...rest }) {
  return <button className={[styles.button, styles[is]].join(' ')} {...rest}>
  {icon ? (
    <div style={{ display: 'flex' }}>
      {icon}&nbsp;{children}
    </div>
  ) : children}
  </button>;
}
