import Head from './Head';
import styles from './BasicLayout.module.css';

import { useDarkMode } from 'next-dark-mode';

export default function BasicLayout({ title, children, rest }) {
  const { darkModeActive } = useDarkMode();

  return (
    <main className={[styles.main, darkModeActive ? styles.dark : ''].join(' ')} {...rest}>
      <Head title={title} />
      {children}
    </main>
  );
};
