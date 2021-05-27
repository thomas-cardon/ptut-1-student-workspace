import Head from 'next/head';

import Sidebar from './Sidebar';
import Searchbar from './Searchbar';

import Card from './Card';
import UpcomingClassCard from './UpcomingClassCard';

import Link from './Link';
import Button from './FormFields/FormButton';

import styles from './UserLayout.module.css';

import Avatar from 'react-avatar';
import { HiAdjustments, HiLogout, HiMoon, HiSun } from "react-icons/hi";

import Loader from 'react-loader-spinner';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

import { useTheme } from 'next-themes';

export default function UserLayout({ title, user, children, header, flex = true, year, ...rest }) {
  const { theme, setTheme } = useTheme();

  return (<>
    <Head>
      <title>{title ? 'SWS | ' + title : 'Student Workspace'}</title>
    </Head>
      <SkeletonTheme color="var(--color-primary-700)" highlightColor="var(--color-primary-200)">
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
              {!user ? <Loader type="Oval" color="var(--color-accent)" style={{ margin: 'auto auto' }} width="100%" /> : (
                <div className={styles.text}>
                  <span className={styles.name}>{user.firstName || 'Anonyme'} {user.lastName}</span>
                  <small className={styles.id}>
                    {user?.isLoggedIn === false && 'Déconnecté'}
                    {user.userType === 0 && user.delegate === false && 'Étudiant'}
                    {user.userType === 0 && user.delegate === true && 'Délégué'}
                    {user.userType === 1 && 'Professeur'}
                    {user.userType === 2 && 'Administration'}
                  </small>
                  <small className={styles.id}>{user.userId ? '#' + user.userId : <Link href="/login">Se reconnecter</Link>}</small>
                </div>)}
              {user?.isLoggedIn ? <Avatar size={80} name={user.firstName + ' ' + user.lastName} mail={user.email} alt="Votre photo de profil" className={styles.avatar} draggable={false} {...user.avatar} /> : <Skeleton circle={true} height={80} width={80} />}
            </div>
            <Button style={{ marginTop: '1em' }} icon={theme === 'light' ? <HiSun /> : <HiMoon />} onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
              {theme === 'light' ? <span>Clair</span> : <span>Sombre</span>}
            </Button>
          </Card>

          <UpcomingClassCard user={user} year={year} />

          <Card className={[styles.card, styles.actions].join(' ')} style={{ alignContent: 'center' }}>
            <p className={styles.text}>
              <span className={styles.title}>Actions</span>
              <span className={styles.subtitle}>Que souhaitez-vous faire ?</span>
            </p>

            <div className="buttons">
              <Link href="/settings">
                <Button icon={<HiAdjustments />} disabled={!user?.isLoggedIn}>Paramètres</Button>
              </Link>

              <Link href="/logout">
                <Button is="danger" icon={<HiLogout />} disabled={!user?.isLoggedIn}></Button>
              </Link>
            </div>
          </Card>
        </aside>
      </main>
    </SkeletonTheme>
  </>);
};
