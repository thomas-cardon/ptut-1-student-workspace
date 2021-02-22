import styles from './Highlight.module.css';

export default function Sidebar({ user, title = 'Important', children, active, setActive }) {
  return (
    <div className={styles.block}>
      <div className={styles.icon}>☝️</div>
      <div className={styles.title}>{title}</div>
      {children}
    </div>
  );
};
