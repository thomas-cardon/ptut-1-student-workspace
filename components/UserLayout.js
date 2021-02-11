import React, { useState } from 'react';

import Head from 'next/head';
import Link from 'next/link';

import Sidebar from './Sidebar';
import styles from './UserLayout.module.css';

import { HiOutlineMenu } from "react-icons/hi";

export default function BasicLayout({ title, user, children }) {
  const [active, setActive] = useState(false);

  return (
    <div className={styles.container}>
      <Head>
        <title>{title || 'Remote Toolbox'}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={styles.menuIcon} onClick={() => setActive(!active)}>
       <HiOutlineMenu />
      </div>


      <header className={styles.header}>
        <div className="header-search">Rechercher...</div>
        {user && <div className="header-avatar">{user?.firstName + ' ' + user?.lastName}</div>}
      </header>
      <Sidebar active={active} setActive={setActive}></Sidebar>

      <main className={styles.main}>
        <div className={styles.overview}>
          {children}
        </div>
      </main>

      <footer className={styles.footer}>
        <p>
          <b>Remote Toolbox</b> — Votre nouvel environnement de travail
        </p>
      </footer>
    </div>
  );
};
