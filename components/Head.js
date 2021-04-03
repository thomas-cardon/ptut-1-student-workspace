import Head from 'next/head';

export default function CustomHead({ title }) {
  return (
    <Head>
      <title>{title || 'Student Workspace'}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="Votre nouvel environnement de travail" />
      <meta charSet="UTF-8" />
      <meta name="theme-color" content="#5575e7" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="manifest" href="/site.webmanifest" />
      <script src="https://js.pusher.com/beams/1.0/push-notifications-cdn.js"></script>
    </Head>
  );
};
