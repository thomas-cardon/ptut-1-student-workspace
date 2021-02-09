import useSWR from 'swr';
import fetch from 'isomorphic-unfetch';

import Head from 'next/head';
import styles from '../styles/Dashboard.module.css';

const fetcher = url => fetch(url).then(r => r.json());

export default function Dashboard({ props }) {
  const { data, error } = useSWR('/api/me/user', fetcher);
  console.dir(data);

  if (error) return <pre><code>{error}</code></pre>
  if (!data) return <div>loading...</div>

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
