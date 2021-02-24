import Head from 'next/head';

export default function CustomHead({ title }) {
  return (
    <Head>
      <title>{title || 'Student Workspace'}</title>
      <link rel="icon" href="/favicon.ico" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content="Votre nouvel environnement de travail" />
      <link rel="manifest" href="/site.webmanifest" />
    </Head>
  );
};
