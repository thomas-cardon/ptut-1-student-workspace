import Head from 'next/head';

import { ToastProvider } from 'react-toast-notifications';
import { ThemeProvider } from 'next-themes';
import { SWRConfig } from 'swr';

import { ConfigProvider } from 'react-avatar';

import { fetcher } from '../lib/hooks';

import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (<ConfigProvider>
    <SWRConfig
      value={{
        fetcher,
        onError: console.error,
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

        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=2" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=1" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=1" />
        <link rel="manifest" href="/site.webmanifest?v=2" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg?v=2" color="#5575e7" />
        <link rel="shortcut icon" href="/favicon.ico?v=1" />
        <meta name="msapplication-TileColor" content="#5575e7" />
        <meta name="theme-color" content="#5575e7" />

        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@800&family=Raleway:wght@100;400;800&display=swap" rel="stylesheet" />

        <meta name='twitter:card' content='summary' />
        <meta name='twitter:url' content='https://student-workspace.vercel.app/' />
        <meta name='twitter:title' content='Student Workspace' />
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
    </SWRConfig>
  </ConfigProvider>);
}

export default MyApp;
