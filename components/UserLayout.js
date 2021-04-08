import React, { useState, useEffect } from 'react';

/*
* Voir pour importer ces fonts par page ou composant, car là on les importe dans toute les pages alors
* qu'elles ne sont pas forcément utilisées partout
*/
import "@fontsource/lato";

import "@fontsource/nunito/800.css";

import "@fontsource/raleway/100.css";
import "@fontsource/raleway/400.css";
import "@fontsource/raleway/800.css";

import Head from './Head';
import Sidebar from './Sidebar';

import styles from './UserLayout.module.css';

import Gravatar from 'react-gravatar';
import { HiAdjustments, HiLogout, HiArrowRight, HiDotsHorizontal, HiMoon, HiColorSwatch } from "react-icons/hi";

import { useDarkMode } from 'next-dark-mode';

import { parseISO, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

import Button from './FormFields/FormButton';

import Link from './Link';
import Card from './Card';

import { useADE } from '../lib/ade';

import { useCurrentClass } from '../lib/hooks';

export default function UserLayout({ title, user, children, header, flex = true, ...rest }) {
  useADE(user);

  const {
    autoModeActive,    // boolean - whether the auto mode is active or not
    autoModeSupported, // boolean - whether the auto mode is supported on this browser
    darkModeActive,    // boolean - whether the dark mode is active or not
    switchToAutoMode,  // function - toggles the auto mode on
    switchToDarkMode,  // function - toggles the dark mode on
    switchToLightMode, // function - toggles the light mode on
  } = useDarkMode();

  const [darkMode, setDarkMode] = useState(-1);
  const { data : current } = useCurrentClass();

  useEffect(() => {
    if (darkMode === -1) switchToAutoMode();
    else if (darkMode === 0) switchToLightMode();
    else if (darkMode === 1) switchToDarkMode();
  }, [darkMode]);

  return (<>
    <Head />
    {darkModeActive ? <style jsx global>{`
        :root {
          --color-button-text: #fff;
          --color-primary-100: #dee3ea;
          --color-primary-200: #b2bdcd;
          --color-primary-300: #5d7290;
          --color-primary-600: #323d4d;
          --color-primary-700: #242c37;
          --color-primary-800: #151a21;
          --color-primary-900: #0b0e11;
          --color-secondary-washed-out: #879eed;
          --color-secondary: #5575e7;
          --color-accent-glow: rgba(253,77,77,0.3);
          --color-accent: #fd4d4d;
          --color-accent-hover: #fd6868;
          --color-accent-disabled: #f5bfbf;
        }
      `}</style> : <style jsx global>{`
        :root {
            font-size: 16px;

            --color-button-text: #fff;
            --color-primary-100: #151a21;
            --color-primary-200: #242c37;
            --color-primary-300: #323d4d;
            --color-primary-600: #5d7290;
            --color-primary-700: #b2bdcd;
            --color-primary-800: #dee3ea;
            --color-primary-900: #fff;

            --color-secondary-washed-out: #879eed;
            --color-secondary: #5575e7;
            --color-accent-glow: rgba(253,77,77,0.3);
            --color-accent: #fd4d4d;
            --color-accent-hover: #fd6868;
            --color-accent-disabled: #f5bfbf;
        }
      `}</style>}
    <main className={[styles.main, darkModeActive ? styles.dark : ''].join(' ')} {...rest}>
      <Sidebar user={user}></Sidebar>

      <section className={styles.content}>
        <header className={styles.header}>
          <div className={styles.content}>
            <div className={styles['input-container']}>
              <div className={styles.icon}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#sm-solid-search_svg__clip0)" fill-rule="evenodd" clip-rule="evenodd"><path d="M7.212 1.803a5.409 5.409 0 100 10.818 5.409 5.409 0 000-10.818zM0 7.212a7.212 7.212 0 1114.424 0A7.212 7.212 0 010 7.212z"></path><path d="M11.03 11.03a.901.901 0 011.275 0l3.43 3.432a.902.902 0 01-1.274 1.275l-3.431-3.431a.901.901 0 010-1.275z"></path></g><defs><clipPath id="sm-solid-search_svg__clip0"><path d="M0 0h16v16H0z"></path></clipPath></defs></svg>
              </div>
              <input id="search" name="search" type="text" placeholder="Recherchez des utilisateurs, des groupes" autoComplete="off" />
            </div>
            {header || <></>}
          </div>
        </header>
        {children}
      </section>

      <aside className={styles['cards-list']}>
        <Card className={styles.card}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
            <div className={styles.text}>
              <span className={styles.name}>{user.firstName} {user.lastName}</span>
              <span className={styles.id}>#{user.userId}</span>
            </div>
            <Gravatar size={80} email={user.email} alt="Votre photo de profil" className={styles.avatar} draggable={false} />
          </div>
          <Button style={{ marginTop: '1em' }} icon={<>
            {darkMode === -1 && <HiColorSwatch />}
            {darkMode === 0  && <HiColorSwatch />}
            {darkMode === 1  && <HiColorSwatch />}
          </>} onClick={() => setDarkMode(darkMode === -1 ? 1 : darkMode - 1)}>
            {darkMode === -1 && (<span>Auto</span>)}
            {darkMode === 0  && (<span>Clair</span>)}
            {darkMode === 1  && (<span>Sombre</span>)}
          </Button>
        </Card>

        {current && !current.error && (
          <Card className={[styles.card, styles.currentClass].join(' ')}>
            <p className={styles.text}>
              <span className={styles.title}>{current.subject.module} {current.subject.name}</span>
              <span className={styles.subtitle}>{current.teacher.firstName} {current.teacher.lastName}</span>
              <span className={styles.subtitle} style={{ color: 'var(--color-accent)' }}>Démarré {formatDistanceToNow(parseISO(current.start), { addSuffix: true, locale: fr })}</span>
            </p>

            <div className="buttons">
              <Button is="danger" icon={<HiMoon />} onClick={() => confirm('(WIP) Se déclarer absent ?')}>Absent ?</Button>
              {current.meetingUrl && (
                <Link href={current.meetingUrl} target="_blank">
                  <Button is="success" icon={<HiArrowRight />}>Connexion</Button>
                </Link>
              )}

              <Link href="/schedule/current">
                <Button icon={<HiDotsHorizontal />}>Voir</Button>
              </Link>
            </div>
          </Card>
        )}

        <Card className={[styles.card, styles.actions].join(' ')}>
          <p className={styles.text}>
            <span className={styles.title}>Actions</span>
            <span className={styles.subtitle}>Que souhaitez-vous faire ?</span>
          </p>

          <div className="buttons">
            <Link href="/settings">
              <Button is="warning" icon={<HiAdjustments />}></Button>
            </Link>

            <Link href="/logout">
              <Button is="danger" icon={<HiLogout />}></Button>
            </Link>
          </div>
        </Card>
      </aside>
    </main>
  </>);
};
