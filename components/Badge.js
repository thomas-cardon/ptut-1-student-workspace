import Head from 'next/head';
import Link from 'next/link';

import styles from './Badge.module.css';

export default function Badge({ children }) {
  return (
    <span className={styles.main}>
      {children}
    </span>
  );
};
