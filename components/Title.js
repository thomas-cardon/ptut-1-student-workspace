import * as defaultStyles from './Title.module.css';
import { useDarkMode } from 'next-dark-mode';

export default function Title({ appendGradient, styles = {}, children }) {
  const { darkModeActive } = useDarkMode();

  return (
    <h1 className={[defaultStyles.title, darkModeActive ? defaultStyles.dark : ''].join(' ')}>
      {children}&nbsp;
      <span className={defaultStyles.gradient}>{appendGradient}</span>
    </h1>
  );
};
