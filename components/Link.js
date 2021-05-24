import Link from 'next/link';
import styles from './Link.module.css';

export default function CustomLink({ id, className, style, children, target, ...rest }) {
  return (
    <Link {...rest}>
      <a id={id} className={[styles.link, className].join(' ')} style={style} target={target}>
        {children}
      </a>
    </Link>
  );
};
