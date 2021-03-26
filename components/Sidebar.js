import React, { useState } from 'react';
import Link from './Link';

import Gravatar from 'react-gravatar';

import { HiOutlineMenu, HiViewGridAdd, HiCalendar, HiAnnotation, HiPencilAlt, HiTable, HiUsers, HiAdjustments, HiLogout } from "react-icons/hi";
import { useDarkMode } from 'next-dark-mode';

import styles from './Sidebar.module.css';

export default function Sidebar({ user, children, active, setActive }) {
  const { darkModeActive } = useDarkMode();
  return (
    <aside className={styles.sidebar} data-active={active ? 1 : 0}>
      <div className={styles.closeIcon} onClick={() => setActive(!active)}>
        <HiOutlineMenu />
      </div>
      <Gravatar size={96} email={user.email} style={{ borderRadius: '50%', margin: '2em auto 1em auto', display: 'block' }} draggable={false} />
      <h3 style={{ margin: '0 auto', color: '#FAFAFA' }}>
        {user.firstName} {user.lastName}
      </h3>
      <ul className={[styles.list, darkModeActive ? styles['list-dark'] : ''].join(' ')}>
        <Link href="/dashboard" className={styles.item}>
          <div className={styles.icon}>
            <HiViewGridAdd />
          </div>
          Tableau de bord
        </Link>

        <Link href="/schedule" className={styles.item}>
          <div className={styles.icon}>
            <HiCalendar />
          </div>
          Emploi du temps
        </Link>

        <Link href="/posts/list" className={styles.item}>
          <div className={styles.icon}>
            <HiAnnotation />
          </div>
          Posts
        </Link>

        <Link href="/grades/list" className={styles.item}>
          <div className={styles.icon}>
            <HiPencilAlt />
          </div>
          {user?.userType === 2 ? 'Notes' : 'Mes notes'}
        </Link>

        {user?.userType == 2 && (<>
          <hr style={{ width: '85%', border: 'none', borderBottom: `1px solid ${darkModeActive ? '#282828' : '#FAFAFA'}` }} />

          <Link href="/subjects/list" className={styles.item}>
            <div className={styles.icon}>
              <HiTable />
            </div>
            Liste des cours
          </Link>
          <Link href="/users/list" className={styles.item}>
            <div className={styles.icon}>
              <HiUsers />
            </div>
            Utilisateurs
          </Link>
        </>)}
      </ul>
      <div className={[styles.iconsGroup, darkModeActive ? styles['dark'] : ''].join(' ')} style={{ flex: 'auto' }}>
        <Link href="/settings">
          <div className={styles.icon}>
            <HiAdjustments />
          </div>
        </Link>

        <Link href="/logout">
          <div className={styles.icon}>
            <HiLogout />
          </div>
        </Link>
      </div>
    </aside>);
};
