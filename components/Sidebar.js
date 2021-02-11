import Head from 'next/head';
import Link from 'next/link';

import styles from './Sidebar.module.css';

import Badge from './Badge';

export default function Sidebar({ title, children }) {
  return (
    <div className={styles.main}>
      <h3 className={styles.title}>Menu</h3>
      <Link href="/posts">
        <a className={styles.link}>Derniers posts <Badge>1</Badge></a>
      </Link>
      <Link href="/schedule">
        <a className={styles.link}>Emploi du temps <Badge>1</Badge></a>
      </Link>
      <hr />
      <Link href="/settings">
        <a className={styles.link}>Paramètres</a>
      </Link>
    </div>
  );
};
