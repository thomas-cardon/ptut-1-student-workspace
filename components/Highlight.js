import styles from './Highlight.module.css';

export default function Highlight({ title = 'Important', icon = '☝️', children }) {
  return (
    <div className={styles.block}>
      <div className={styles.icon}>{icon}</div>
      <div className={styles.title}>{title}</div>
      {children}
    </div>
  );
};
