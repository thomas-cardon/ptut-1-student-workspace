import Link from 'next/link';

import * as defaultStyles from './Link.module.css';
import { useDarkMode } from 'next-dark-mode';

export default function Title({ className, style, children, target, ...rest }) {
  const { darkModeActive } = useDarkMode();

  return (
    <Link {...rest}>
      <a className={[defaultStyles.link, darkModeActive ? defaultStyles.dark : '', className].join(' ')} style={style} target={target}>
        {children}
      </a>
    </Link>
  );
};
