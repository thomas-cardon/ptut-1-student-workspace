import "@fontsource/nunito/800.css"
import styles from "./FormButton.module.css";

import FormGroup from "./FormGroup";

export default function FormButton({ is, children, icon, ...rest }) {
  return <button className={[styles.button, styles[is]].join(' ')} {...rest}>
  {icon && children ? (
    <div style={{ display: 'flex', alignItems: 'center', weight: '100%', height: '100%' }}>
      {icon}&nbsp;{children}
    </div>
  ) : (children || icon)}
  </button>;
}
