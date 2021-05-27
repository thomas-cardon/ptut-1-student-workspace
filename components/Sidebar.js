import React, { useState } from 'react';
import Image from 'next/image';
import Link from './Link';

import { HiOutlineMenu, HiViewGridAdd, HiCalendar, HiAnnotation, HiPencilAlt, HiTable, HiUsers, HiCollection, HiSparkles } from "react-icons/hi";

import styles from './Sidebar.module.css';

export default function Sidebar({ user, children, active, setActive }) {
  return (
    <aside data-active={active ? 1 : 0} className={styles.sidebar}>
      <Link href="/dashboard">
        <div className={styles.brand}>
          <Image
            src="/android-chrome-512x512.png"
            alt="Logo"
            width={40}
            height={40}
          />
          <h3>Student Workspace</h3>
        </div>
      </Link>
      <div className={styles.list}>
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

        <Link href="/news" className={styles.item}>
          <div className={styles.icon}>
            <HiCollection />
          </div>
          Newsfeed (beta)
        </Link>

        <Link href="/posts" className={styles.item}>
          <div className={styles.icon}>
            <HiAnnotation />
          </div>
          Informations
        </Link>

        {user?.isLoggedIn && user?.userType === 2 && (<>
          <hr />
          <Link href="/subjects" className={styles.item}>
            <div className={styles.icon}>
              <HiTable />
            </div>
            Matières
          </Link>
          <Link href="/users" className={styles.item}>
            <div className={styles.icon}>
              <HiUsers />
            </div>
            Étudiants
          </Link>
        </>)}

        <hr />

        <Link href="/legal" className={styles.item}>
          <div className={styles.icon}>
            <HiSparkles />
          </div>
          CGU
        </Link>
      </div>
    </aside>);
};
