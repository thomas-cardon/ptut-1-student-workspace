import Head from 'next/head';

import { ToastProvider } from 'react-toast-notifications';
import { ThemeProvider } from 'next-themes';
import { SWRConfig } from 'swr';

import fetch from "../lib/fetchJson";

import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (<SWRConfig
      value={{
        fetcher: fetch,
        onError: (err) => {
          console.error(err);
        },
      }}
    >
      <Head>
        <title>{pageProps?.title ? `SWS | ${pageProps.title}` : 'Student Workspace'}</title>

        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover" />
        <meta name="description" content="Votre nouvel environnement de travail" />

        <meta charSet="UTF-8" />
        
        <meta name='application-name' content='Student Workspace' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='default' />
        <meta name='apple-mobile-web-app-title' content='Student Workspace' />
        <meta name='description' content='Votre nouvel environnement de travail' />
        <meta name='format-detection' content='telephone=no' />
        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='theme-color' content='#5575e7' />

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

        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@800&family=Raleway:wght@100;400;800&display=swap" rel="stylesheet" />

        <meta name='twitter:card' content='summary' />
        <meta name='twitter:url' content='https://student-workspace.vercel.app/' />
        <meta name='twitter:title' content='PWA App' />
        <meta name='twitter:description' content='Votre nouvel environnement de travail' />
        <meta name='twitter:image' content='https://student-workspace.vercel.app/icon-192x192.png' />
        <meta name='twitter:creator' content='@Ryzzzen' />
        <meta property='og:type' content='website' />
        <meta property='og:title' content='Student Workspace' />
        <meta property='og:description' content='Votre nouvel environnement de travail' />
        <meta property='og:site_name' content='SWS' />
        <meta property='og:url' content='https://student-workspace.vercel.app/' />
        <meta property='og:image' content='https://student-workspace.vercel.app/preview.png' />

        <script src="https://js.pusher.com/beams/1.0/push-notifications-cdn.js" />
      </Head>
      <ThemeProvider defaultTheme="dark">
        <ToastProvider autoDismiss={true}>
          <Component {...pageProps} />
        </ToastProvider>
      </ThemeProvider>
    </SWRConfig>);
}

export default MyApp;
