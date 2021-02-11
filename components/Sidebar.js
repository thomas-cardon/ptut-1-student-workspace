import Head from 'next/head';
import Link from 'next/link';

import styles from './Sidebar.module.css';

import Badge from './Badge';

import { HiOutlineAdjustments, HiCalendar, HiCollection } from "react-icons/hi";

export default function Sidebar({ title, children }) {
  return (
    <div className={styles.main}>
      <h3 className={styles.title}>Menu</h3>
      <Link href="/posts">
        <a className={styles.link}><Badge>1</Badge>&nbsp;&nbsp;<HiCollection className={styles.icon} />Derniers posts</a>
      </Link>
      <Link href="/schedule">
        <a className={styles.link}><Badge>1</Badge>&nbsp;&nbsp;<HiCalendar className={styles.icon} />Emploi du temps</a>
      </Link>
      <hr />
      <Link href="/settings">
        <a className={styles.link}><HiOutlineAdjustments className={styles.icon} />Paramètres</a>
      </Link>
    </div>
  );
};
