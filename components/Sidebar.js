import React, { useState } from 'react';

import Link from 'next/link';

import styles from './Sidebar.module.css';

import Badge from './Badge';

import { HiOutlineAdjustments, HiCalendar, HiCollection, HiOutlineMenu } from "react-icons/hi";

export default function Sidebar({ user, children, active, setActive }) {
  return (
    <aside className={styles.sidebar} data-active={active ? 1 : 0}>
      <div className={styles.closeIcon} onClick={() => setActive(!active)}>
        <HiOutlineMenu />
      </div>
      <ul className={styles.list}>
        <Link href="/dashboard">
          <a className={styles.item}>Tableau de bord</a>
        </Link>

        <hr style={{ width: '85%' }} />

        <Link href="/schedule">
          <a className={styles.item}>Emploi du temps <Badge>1</Badge></a>
        </Link>

        <hr style={{ width: '85%' }} />

        <Link href="/posts/list">
          <a className={styles.item}>Derniers posts <Badge>1</Badge></a>
        </Link>

        <Link href="/class/list">
          <a className={styles.item}>Liste des cours</a>
        </Link>

        {user?.userId > 0 && (<>
          <hr style={{ width: '85%' }} />
          <Link href="/posts/create">
            <a className={styles.item}>Créer un nouveau post</a>
          </Link>
          <Link href="/class/create">
            <a className={styles.item}>Créer un nouveau cours</a>
          </Link>
        </>)}
        <hr style={{ width: '85%' }} />

        <Link href="/settings">
          <a className={styles.item}>Réglages</a>
        </Link>
      </ul>
      </aside>);
};
