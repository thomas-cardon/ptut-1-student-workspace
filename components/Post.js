import Link from './Link';
import Gravatar from 'react-gravatar';

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import styles from "./Post.module.css";

import { useDarkMode } from 'next-dark-mode';

export default function Post({ id, title, content, module, authorName, creationTime, email, children }) {
  const { darkModeActive } = useDarkMode();

  return (
    <article className={[styles.article, darkModeActive ? styles.dark : ''].join(' ')}>
      {children ? children : (<>
        <div className={styles.module}>
          {module && (
            <Link href={{ pathname: '/posts/list', query: { module } }}>
              {module}
            </Link>
          )}
        </div>
        <h2 className={styles.title}>
          <Link href={'/posts/' + id}>
            {title}
          </Link>
        </h2>
        <div className={styles.meta}>
           <span className={styles.author}>
              <span className={styles.avatar}>
                <Gravatar size={30} email={email} alt={authorName} className={styles.avatarImage} draggable={false} />
              </span>
              {authorName}
           </span>
           {creationTime && (
             <span className={styles.date}>{format(creationTime, 'd MMMM yyyy', { locale: fr })}</span>
           )}
        </div>
      </>)}
    </article>
  );
}
