import React, { useState } from 'react';

import Head from './Head';
import Link from 'next/link';

import Sidebar from './Sidebar';
import styles from './UserLayout.module.css';

import { HiOutlineMenu } from "react-icons/hi";

import { useDarkMode } from 'next-dark-mode';

export default function UserLayout({ title, user, children, header, flex = true, ...rest }) {
  const [active, setActive] = useState(false);
  const { darkModeActive } = useDarkMode();

  return (
    <div className={[styles.container, darkModeActive ? styles.dark : ''].join(' ')} {...rest}>
      <Head>
        <title>{title || 'Student Workspace'}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Votre nouvel environnement de travail" />
        <link rel="apple-touch-icon" href="/favicon-192x192.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>

      <div className={styles.menuIcon} onClick={() => setActive(!active)}>
       <HiOutlineMenu />
      </div>


      <header className={[styles.header, darkModeActive ? styles.dark : ''].join(' ')}>
        {user && <div className="header-avatar">{user?.firstName + ' ' + user?.lastName} — <Link href="/logout"><a style={{ color: '#34495e' }}>Se déconnecter</a></Link></div>}
        {header}
      </header>
      <Sidebar user={user} active={active} setActive={setActive}></Sidebar>

      <main className={[styles.main, darkModeActive ? styles.dark : ''].join(' ')}>
        <div className={styles[flex ? 'flex' : 'overview']}>
          {children}
        </div>
      </main>

      <footer className={[styles.footer, darkModeActive ? styles.dark : ''].join(' ')}>
        <p>
          <b>Student Workspace</b> — Votre nouvel environnement de travail
        </p>
      </footer>
    </div>
  );
};
