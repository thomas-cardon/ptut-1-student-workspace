import { ToastProvider } from 'react-toast-notifications';
import withDarkMode from 'next-dark-mode';

import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <ToastProvider autoDismiss={true}>
      <Component {...pageProps} />
    </ToastProvider>
  );
}

export default withDarkMode(MyApp);
