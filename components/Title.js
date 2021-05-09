import styles from './Title.module.css';

export default function Title({ appendGradient, subtitle, button, centered, style = {}, children }) {
  return (
    <div className={styles.content} style={style}>
      <h1 className={styles.title}>
        {children}&nbsp;
        <span className={styles.gradient}>{appendGradient}</span>
      </h1>
      <div className={styles.subtitleContent}>
        {button || <></>}
        {subtitle && (<span className={styles.subtitle}>{subtitle}</span>)}
      </div>
    </div>
  );
};
