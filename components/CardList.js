import styles from './CardList.module.css';

export default function CardList({ className, children }) {
  return (
    <div className={[styles.list, className].join(' ')}>
      {children}
    </div>
  );
};
