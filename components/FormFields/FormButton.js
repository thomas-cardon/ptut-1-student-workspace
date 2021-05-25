import styles from "./FormButton.module.css";

import FormGroup from "./FormGroup";

export default function FormButton({ is, center, children, icon, type, className, ref, ...rest }) {
  return <button className={[styles.button, styles[is], type, className].join(' ')} ref={ref} {...rest}>
  {icon && children ? (
    <div className={[styles.content, center ? styles.center : ''].join(' ')}>
      {icon}&nbsp;{children}
    </div>
  ) : icon || <span>{children}</span>}
  </button>;
}
