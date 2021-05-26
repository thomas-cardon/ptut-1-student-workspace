import Head from 'next/head';
import styles from './BasicLayout.module.css';

export default function BasicLayout({ title, disableBackground, children, className, ...rest }) {
  return (<>
    <Head>
      <title>{title ? 'SWS | ' + title : 'Student Workspace'}</title>
    </Head>
    <main className={[styles.main, disableBackground ? styles.nobg : '', className].join(' ')} {...rest}>
      {children}
    </main>
  </>);
};
