import React, { useState } from 'react';
import Link from 'next/link';

import { HiOutlineMenu, HiViewGridAdd, HiCalendar, HiAnnotation, HiPencilAlt, HiTable, HiUsers, HiAdjustments } from "react-icons/hi";
import { useDarkMode } from 'next-dark-mode';

import styles from './Sidebar.module.css';
import { getAvatar } from '../lib/useUser';

export default function Sidebar({ user, children, active, setActive }) {
  const { darkModeActive } = useDarkMode();
  return (
    <aside className={styles.sidebar} data-active={active ? 1 : 0}>
      <div className={styles.closeIcon} onClick={() => setActive(!active)}>
        <HiOutlineMenu />
      </div>
      <img style={{ borderRadius: '50%', width: '35%', margin: '2em auto 1em auto', display: 'block' }} src={getAvatar(user)} />
      <h3 style={{ margin: '0 auto', color: '#FAFAFA' }}>
        {user.firstName} {user.lastName}
      </h3>
      <ul className={[styles.list, darkModeActive ? styles['list-dark'] : ''].join(' ')}>
        <Link href="/dashboard">
          <a className={styles.item}>
            <div className={styles.icon}>
              <HiViewGridAdd />
            </div>
            Tableau de bord
          </a>
        </Link>

        <Link href="/schedule">
          <a className={styles.item}>
            <div className={styles.icon}>
              <HiCalendar />
            </div>
            Emploi du temps
          </a>
        </Link>

        <Link href="/posts/list">
          <a className={styles.item}>
            <div className={styles.icon}>
              <HiAnnotation />
            </div>
            Posts
          </a>
        </Link>

        <Link href="/subjects/list">
          <a className={styles.item}>
            <div className={styles.icon}>
              <HiPencilAlt />
            </div>
            Mes notes
          </a>
        </Link>

        {user?.userType == 2 && (<>
          <hr style={{ width: '85%', border: 'none', borderBottom: `1px solid ${darkModeActive ? '#282828' : '#FAFAFA'}` }} />

          <Link href="/users/list">
            <a className={styles.item}>
              <div className={styles.icon}>
                <HiTable />
              </div>
              Liste des cours
            </a>
          </Link>
          <Link href="/grades/list">
            <a className={styles.item}>
              <div className={styles.icon}>
                <HiUsers />
              </div>
              Utilisateurs
            </a>
          </Link>

          <Link href="/settings">
            <a className={[styles.settings, darkModeActive ? styles['settings-dark'] : ''].join(' ')}>
              <div className={styles.icon}>
                <HiAdjustments />
              </div>
            </a>
          </Link>

          <Link href="/logout">
            <a style={{ textAlign: 'center', display: 'block', color: darkModeActive ? '#282828' : '#FAFAFA' }}>
              Se déconnecter
            </a>
          </Link>
        </>)}
      </ul>
      </aside>);
};
