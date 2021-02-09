import useSWR from 'swr';
import fetch from 'isomorphic-unfetch';

import Head from 'next/head';
import styles from '../styles/Dashboard.module.css';

const fetcher = url => fetch(url).then(r => r.json());

export default function Dashboard({ props }) {

  return (
    <div className={styles.container}>
      <Head>
        <title>Remote Toolbox</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>Connectez-vous pour accéder au tableau de bord</h1>
        <form>
            <fieldset>
                <legend>Connexion</legend>
                <input type="email" placeholder="Adresse mail" />
                <input type="password" placeholder="Mot de passe" />
                <button type="submit">Se connecter</button>
            </fieldset>
        </form>
      </main>
    </div>
  );
};
