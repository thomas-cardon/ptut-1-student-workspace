import React, { useState, useEffect } from 'react';
import Head from 'next/head';

import Sidebar from './Sidebar';
import Searchbar from './Searchbar';

import styles from './UserLayout.module.css';

import Avatar from 'react-avatar';
import { HiAdjustments, HiLogout, HiArrowRight, HiDotsHorizontal, HiMoon, HiSun, HiColorSwatch } from "react-icons/hi";

import Loader from 'react-loader-spinner';

import { useTheme } from 'next-themes';
import { parseISO, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

import Button from './FormFields/FormButton';

import Link from './Link';
import Card from './Card';

const isServer = () => typeof window === `undefined`;

import { useADE, getClasses, getCurrentCourse } from '../lib/ade';
import { useCurrentClass } from '../lib/hooks';

export default function UserLayout({ title, user, children, header, flex = true, year, ...rest }) {
  const { theme, setTheme } = useTheme();

  const [current, setCurrentCourse] = useState(null);

  /* désactivation SWS
  const { data : currentSWS } = useCurrentClass();

  useEffect(() => {
    if (currentSWS && !currentSWS.error) setCurrentCourse(current);
    console.dir(currentSWS);
  }, [currentSWS]);
  */

  if (!isServer()) {
    useEffect(() => {
      function exec() {
        useADE(user, undefined, undefined, year)
        .then(calendar =>
          getCurrentCourse({ user, year, calendar })
          .then(setCurrentCourse).catch(console.error))
        .catch(console.error);
      }

      exec();

      const intervalId = setInterval(exec, 30*60*1000);
      return () => clearInterval(intervalId);
    }, [user, year]);
  }

  return (<>
    <Head>
      <title>{title ? 'SWS | ' + title : 'Student Workspace'}</title>
    </Head>
    <main className={styles.main} {...rest}>
      <Sidebar user={user}></Sidebar>

      <section className={styles.content}>
        <header className={styles.header}>
          <div className={styles.content}>
            <Searchbar />
            {header || <></>}
          </div>
        </header>
        {children}
      </section>

      <aside className={styles['cards-list']}>
        <Card className={styles.card}>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', userSelect: 'none' }}>
            {!user?.isLoggedIn ? <Loader type="Oval" color="var(--color-accent)" style={{ margin: 'auto auto' }} width="100%" /> : (
              <div className={styles.text}>
                <span className={styles.name}>{user.firstName} {user.lastName}</span>
                <span className={styles.id}>
                  {user.userType === 0 && user.delegate === false && 'Étudiant'}
                  {user.userType === 0 && user.delegate === true && 'Délégué'}
                  {user.userType === 1 && 'Professeur'}
                  {user.userType === 2 && 'Administration'}
                </span>
                <span className={styles.id}>#{user.userId}</span>
              </div>)}
            {user?.isLoggedIn && <Avatar size={80} name={user.firstName + ' ' + user.lastName} mail={user.email} alt="Votre photo de profil" className={styles.avatar} draggable={false} {...user.avatar} />}
          </div>
          <Button style={{ marginTop: '1em' }} icon={theme === 'light' ? <HiSun /> : <HiMoon />} onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            {theme === 'light' ? <span>Clair</span> : <span>Sombre</span>}
          </Button>
        </Card>

        {current && current.teacher && ( /* SWS */
          <Card className={[styles.card, styles.currentClass].join(' ')} style={{ alignContent: 'center' }}>
            <p className={styles.text}>
              <span className={styles.title}>{current.subject.module} {current.subject.name}</span>
              <span className={styles.subtitle}>{current.teacher.firstName} {current.teacher.lastName}</span>
              <span className={styles.subtitle} style={{ color: 'var(--color-accent)' }}>Démarré {formatDistanceToNow(parseISO(current.start), { addSuffix: true, locale: fr })}</span>
            </p>

            <div className="buttons">
              <Button is="danger" icon={<HiMoon />} onClick={() => confirm('(WIP) Se déclarer absent ?')}>Absent ?</Button>
              {current.meetingUrl && (
                <Link href={current.meetingUrl} target="_blank">
                  <Button is="success" icon={<HiArrowRight />}>Rejoindre</Button>
                </Link>
              )}

              <Link href="/schedule/current">
                <Button icon={<HiDotsHorizontal />}>Voir</Button>
              </Link>
            </div>
          </Card>
        )}

        {current?.summary && ( /* ADE */
          <Card className={[styles.card, styles.currentClass].join(' ')}>
            <p className={styles.text}>
              <span className={styles.title}>{current.summary}</span>
              <span className={styles.subtitle}><i>{current.description ? current.description.trim() : 'Sans description'}</i></span>
              <span className={styles.subtitle}><b>{current.location}</b></span>
              <span className={styles.subtitle} style={{ color: 'var(--color-accent)' }}>Démarré {formatDistanceToNow(current.start, { addSuffix: true, locale: fr })}</span>
            </p>

            <div className="buttons">
              <Button icon={<HiDotsHorizontal />}>Voir</Button>
              <Link href={current?.meeting || '#'} target="_blank">
                <Button is="success" icon={<HiArrowRight />} disabled={typeof current.meeting === 'undefined'}>Rejoindre</Button>
              </Link>
            </div>
          </Card>
        )}

        <Card className={[styles.card, styles.actions].join(' ')} style={{ alignContent: 'center' }}>
          <p className={styles.text}>
            <span className={styles.title}>Actions</span>
            <span className={styles.subtitle}>Que souhaitez-vous faire ?</span>
          </p>

          <div className="buttons">
            <Link href="/settings">
              <Button icon={<HiAdjustments />}>Paramètres</Button>
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
