import Head from 'next/head';

import { ToastProvider } from 'react-toast-notifications';
import withDarkMode from 'next-dark-mode';

import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (<>
    <Head>
      <title>{pageProps?.title ? `SWS | ${pageProps.title}` : 'Student Workspace'}</title>

      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="Votre nouvel environnement de travail" />

      <meta property="og:title" content="Student Workspace" key="title" />

      <meta charSet="UTF-8" />

      <meta name="theme-color" content="#5575e7" />

      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png" />
      <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png" />
      <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png" />
      <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png" />
      <link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png" />
      <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png" />
      <link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png" />
      <link rel="icon" type="image/png" sizes="192x192"  href="/android-icon-192x192.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/manifest.json" />
      <meta name="msapplication-TileColor" content="#5575e7" />
      <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />

      <script src="https://js.pusher.com/beams/1.0/push-notifications-cdn.js" />
    </Head>
    <ToastProvider autoDismiss={true}>
      <Component {...pageProps} />
    </ToastProvider>
  </>);
}

export default withDarkMode(MyApp);
