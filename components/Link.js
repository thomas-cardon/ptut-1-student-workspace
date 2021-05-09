import Link from 'next/link';
import styles from './Link.module.css';

export default function Title({ className, style, children, target, ...rest }) {

  return (
    <Link {...rest}>
      <a className={[styles.link, className].join(' ')} style={style} target={target}>
        {children}
      </a>
    </Link>
  );
};
