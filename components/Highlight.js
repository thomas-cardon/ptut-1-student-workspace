import styles from './Highlight.module.css';

export default function Highlight({ title = 'Important', icon = '☝️', style, children }) {
  return (
    <div className={styles.block} style={style}>
      <div className={styles.icon}>{icon}</div>
      <div className={styles.title}>{title}</div>
      {children}
    </div>
  );
};
