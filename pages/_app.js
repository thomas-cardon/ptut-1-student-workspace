import { ToastProvider } from 'react-toast-notifications';

import "@fontsource/open-sans";
import "@fontsource/lato";

import '../styles/globals.css';

import withDarkMode from 'next-dark-mode'

function MyApp({ Component, pageProps }) {
  return (
    <ToastProvider autoDismiss={true}>
      <Component {...pageProps} />
    </ToastProvider>
  );
}

export default withDarkMode(MyApp);
