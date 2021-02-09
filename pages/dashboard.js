import useSWR from 'swr';

import { useRouter } from 'next/router';
import Head from 'next/head';

import styles from '../styles/Dashboard.module.css';

export default function Dashboard({ props }) {
  const router = useRouter();
  const { data, error } = useSWR('/api/me/user');

  if (error) {
    console.error(error);
    return <div>Une erreur est survenue</div>;
  }
  if (!data) return <div>Chargement...</div>
  if (!data.success && data.error == 'NOT_AUTHORIZED') return router.push('/login');

  return (
    <div className={styles.container}>
      <Head>
        <title>Remote Toolbox</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Salut, {data.user.firstName} !
        </h1>
      </main>
    </div>
  );
};
