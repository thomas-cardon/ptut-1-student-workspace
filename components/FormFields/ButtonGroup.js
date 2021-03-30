import styles from "./ButtonGroup.module.css";
import { useDarkMode } from 'next-dark-mode';

export default function ButtonGroup({ style = {}, children, ...rest }) {
  const { darkModeActive } = useDarkMode();

  return (
    <div className={[styles.btnGroup, darkModeActive ? styles.dark : ''].join(' ')} style={style}>
      {children}
    </div>
  );
}
