import React, { useState } from 'react';
import Link from './Link';

import { HiOutlineMenu, HiViewGridAdd, HiCalendar, HiAnnotation, HiPencilAlt, HiTable, HiUsers, HiSparkles } from "react-icons/hi";
import { useDarkMode } from 'next-dark-mode';

import styles from './Sidebar.module.css';

export default function Sidebar({ user, children, active, setActive }) {
  const { darkModeActive } = useDarkMode();
  return (
    <aside data-active={active ? 1 : 0} className={styles.sidebar}>
      <Link href="/dashboard">
        <div className={styles.brand}>
          <img width="40px" height="40px" src="/icon-384x384.png" />
          <h3>Student Workspace</h3>
        </div>
      </Link>
      <div className={[styles.list, darkModeActive ? styles['list-dark'] : ''].join(' ')}>
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
          Informations
        </Link>

        {user?.userType !== 2 && (
          <Link href="/grades/list" className={styles.item}>
            <div className={styles.icon}>
              <HiPencilAlt />
            </div>
            Mes notes
          </Link>
        )}

        {user?.userType === 2 && (<>
          <hr />

          <Link href="/subjects/list" className={styles.item}>
            <div className={styles.icon}>
              <HiTable />
            </div>
            Matières
          </Link>
          <Link href="/users/list" className={styles.item}>
            <div className={styles.icon}>
              <HiUsers />
            </div>
            Étudiants
          </Link>

          <Link href="/grades/list" className={styles.item}>
            <div className={styles.icon}>
              <HiPencilAlt />
            </div>
            Notes
          </Link>
        </>)}

        <Link href="/legal" className={styles.item}>
          <div className={styles.icon}>
            <HiSparkles />
          </div>
          Mentions légales
        </Link>
      </div>
    </aside>);
};
