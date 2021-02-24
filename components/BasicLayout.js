import Head from './Head';
import styles from './BasicLayout.module.css';

import { useDarkMode } from 'next-dark-mode';

export default function BasicLayout({ title, children, rest }) {
  const { darkModeActive } = useDarkMode();

  return (
    <div className={[styles.flex, darkModeActive ? styles.dark : ''].join(' ')} {...rest}>
      <Head>
        <title>{title || 'Student Workspace'}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Votre nouvel environnement de travail" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>

      {children}
    </div>
  );
};
