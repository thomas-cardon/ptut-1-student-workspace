import React, { useState } from 'react';

import Head from './Head';
import Sidebar from './Sidebar';

import styles from './UserLayout.module.css';

import { HiAdjustments, HiLogout } from "react-icons/hi";

import { useDarkMode } from 'next-dark-mode';

import FormInput from './FormFields/FormInput';
import Button from './FormFields/FormButton';

export default function UserLayout({ title, user, children, header, flex = true, ...rest }) {
  const [active, setActive] = useState(false);
  const { darkModeActive } = useDarkMode();

  return (<>
    <Head>
      <title>{title || 'Student Workspace'}</title>
      <link rel="icon" href="/favicon.ico" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content="Votre nouvel environnement de travail" />
      <link rel="apple-touch-icon" href="/favicon-192x192.png" />
      <link rel="manifest" href="/site.webmanifest" />
    </Head>
    <main className={styles.main} {...rest}>
      <Sidebar user={user} active={active} setActive={setActive}></Sidebar>

      <section className={styles.content}>
        <header className={styles.header}>
          <div className={styles.content}>
            <div className={styles['input-container']}>
              <div className={styles.icon}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#sm-solid-search_svg__clip0)" fill-rule="evenodd" clip-rule="evenodd"><path d="M7.212 1.803a5.409 5.409 0 100 10.818 5.409 5.409 0 000-10.818zM0 7.212a7.212 7.212 0 1114.424 0A7.212 7.212 0 010 7.212z"></path><path d="M11.03 11.03a.901.901 0 011.275 0l3.43 3.432a.902.902 0 01-1.274 1.275l-3.431-3.431a.901.901 0 010-1.275z"></path></g><defs><clipPath id="sm-solid-search_svg__clip0"><path d="M0 0h16v16H0z"></path></clipPath></defs></svg>
              </div>
              <input id="search" name="search" type="text" placeholder="Recherchez des utilisateurs, des groupes" />
            </div>
            {header || <></>}
          </div>
        </header>
        {children}
      </section>

      <aside className={styles['cards-list']}>
        <div className={styles.card}>
          <div className="">
            <div className={styles.profile}>
              <img alt="avatar" className={styles.avatar} src="https://avatars.githubusercontent.com/u/5779685?v=4" />
              <p className={styles.text}>
                <span className={styles.name}>Thomas Cardon</span>
                <br />
                <span className={styles.id}>#9ARPYBH6I0IH</span>
              </p>
            </div>
            <div className="mt-2"></div>
          </div>
        </div>

        <div className={[styles.card, styles.actions].join(' ')}>
          <p className={styles.text}>
            <span className={styles.title}>Actions</span>
            <br />
            <span className={styles.subtitle}>Que souhaitez-vous faire ?</span>
          </p>

          <div className="buttons">
            <Button>
              <HiAdjustments />
            </Button>
            <Button is="danger">
              <div style={{ display: 'flex' }}>
                <HiLogout />&nbsp;Déconnexion
              </div>
            </Button>
          </div>
        </div>
      </aside>
    </main>
  </>);
};
