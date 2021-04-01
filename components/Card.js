import styles from './Card.module.css';

export default function Card({ className, children }) {
  return (
    <div className={[styles.card, className].join(' ')}>
      {children}
    </div>
  );
};
