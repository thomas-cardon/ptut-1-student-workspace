import styles from './Title.module.css';
import { useDarkMode } from 'next-dark-mode';

export default function Title({ appendGradient, styles = {}, children }) {
  const { darkModeActive } = useDarkMode();

  return (
    <h1 className={styles.title}>
      {children}&nbsp;
      <span className={styles.gradient}>{appendGradient}</span>
    </h1>
  );
};
