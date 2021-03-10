import React, { useState } from 'react';
import Link from 'next/link';

import { HiOutlineMenu } from "react-icons/hi";

import styles from './Sidebar.module.css';
import { getAvatar } from '../lib/useUser';

export default function Sidebar({ user, children, active, setActive }) {
  return (
    <aside className={styles.sidebar} data-active={active ? 1 : 0}>
      <div className={styles.closeIcon} onClick={() => setActive(!active)}>
        <HiOutlineMenu />
      </div>
      <img style={{ borderRadius: '50%', width: '50%', margin: '2em auto 1em auto', display: 'block' }} src={getAvatar(user)} />
      <h3 style={{ margin: '0 auto', color: 'white' }}>
        {user.firstName} {user.lastName}
      </h3>
      <ul className={styles.list}>
        <Link href="/dashboard">
          <a className={styles.item}>Tableau de bord</a>
        </Link>

        <Link href="/schedule">
          <a className={styles.item}>Emploi du temps</a>
        </Link>

        <Link href="/posts/list">
          <a className={styles.item}>Posts</a>
        </Link>

        <Link href="/subjects/list">
          <a className={styles.item}>Mes notes</a>
        </Link>

        {user?.userType == 2 && (<>
          <hr style={{ width: '85%' }} />
          <Link href="/users/list">
            <a className={styles.item}>Liste des cours</a>
          </Link>
          <Link href="/grades/list">
            <a className={styles.item}>Utilisateurs</a>
          </Link>
        </>)}
      </ul>
      </aside>);
};
