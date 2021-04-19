import { ToastProvider } from 'react-toast-notifications';

import '../styles/globals.css';

import withDarkMode, { useDarkMode } from 'next-dark-mode'

function MyApp({ Component, pageProps }) {
  const { darkModeActive } = useDarkMode();

  return (
    <ToastProvider autoDismiss={true}>
      {darkModeActive ? <style jsx global>{`
          :root {
            --color-button-text: #fff;
            --color-primary-100: #dee3ea;
            --color-primary-200: #b2bdcd;
            --color-primary-300: #5d7290;
            --color-primary-600: #323d4d;
            --color-primary-700: #242c37;
            --color-primary-800: #151a21;
            --color-primary-900: #0b0e11;
            --color-secondary-washed-out: #879eed;
            --color-secondary: #5575e7;
            --color-accent-glow: rgba(253,77,77,0.3);
            --color-accent: #fd4d4d;
            --color-accent-hover: #fd6868;
            --color-accent-disabled: #f5bfbf;
          }
        `}</style> : <style jsx global>{`
          :root {
              font-size: 16px;

              --color-button-text: #fff;
              --color-primary-100: #151a21;
              --color-primary-200: #242c37;
              --color-primary-300: #323d4d;
              --color-primary-600: #5d7290;
              --color-primary-700: #b2bdcd;
              --color-primary-800: #dee3ea;
              --color-primary-900: #fff;

              --color-secondary-washed-out: #879eed;
              --color-secondary: #5575e7;
              --color-accent-glow: rgba(253,77,77,0.3);
              --color-accent: #fd4d4d;
              --color-accent-hover: #fd6868;
              --color-accent-disabled: #f5bfbf;
          }
        `}</style>}
      <Component {...pageProps} />
    </ToastProvider>
  );
}

export default withDarkMode(MyApp);
