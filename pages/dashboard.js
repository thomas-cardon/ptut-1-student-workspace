import useSWR from 'swr';
import useUser from '../lib/useUser';

import Head from 'next/head';

import styles from '../styles/Dashboard.module.css';

export default function Dashboard({ props }) {
  const { user } = useUser({ redirectNotAuthorized: '/login', redirectOnError: '/error' }); /* Redirection si l'utilisateur n'est pas connecté */
  if (!user) return <div className={styles.container}>Loading...</div>

  console.dir(user);

  return (
    <div className={styles.container}>
      <Head>
        <title>Remote Toolbox</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Salut, {user.firstName} !
        </h1>
      </main>
    </div>
  );
};
