import "@fontsource/nunito/800.css"
import styles from "./FormButton.module.css";

import FormGroup from "./FormGroup";

export default function FormButton({ is, children, icon, ...rest }) {
  return <button className={[styles.button, styles[is]].join(' ')} {...rest}>
  {icon && children ? (
    <div className={styles.content}>
      {icon}&nbsp;{children}
    </div>
  ) : icon || <span>{children}</span>}
  </button>;
}
