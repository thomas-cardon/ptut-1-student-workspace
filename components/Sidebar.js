import React, { useState } from 'react';
import Link from 'next/link';

import Badge from './Badge';
import { HiOutlineMenu } from "react-icons/hi";

import styles from './Sidebar.module.css';

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
          <a className={styles.item}>Emploi du temps</a>
        </Link>

        <hr style={{ width: '85%' }} />

        <Link href="/posts/list">
          <a className={styles.item}>Derniers posts</a>
        </Link>

        <Link href="/subjects/list">
          <a className={styles.item}>Liste des cours</a>
        </Link>

        {user?.userType == 2 && (<>
          <hr style={{ width: '85%' }} />
          <Link href="/users/list">
            <a className={styles.item}>Liste des utilisateurs</a>
          </Link>
          <Link href="/grades/list">
            <a className={styles.item}>Notes enregistrées</a>
          </Link>
          <Link href="/schedule/edit">
            <a className={styles.item}>Ajouter à l'emploi du temps</a>
          </Link>
        </>)}
        <hr style={{ width: '85%' }} />

        <Link href="/settings">
          <a className={styles.item}>Réglages</a>
        </Link>
      </ul>
      </aside>);
};
