import styles from './BasicLayout.module.css';

export default function BasicLayout({ title, disableBackground, children, rest }) {
  return (
    <main className={[styles.main, disableBackground ? styles.nobg : ''].join(' ')} {...rest}>
      {children}
    </main>
  );
};
