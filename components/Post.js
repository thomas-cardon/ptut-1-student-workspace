import Link from './Link';
import Avatar from 'react-avatar';

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import styles from "./Post.module.css";

export default function Post({ id, title, content, module, authorName, creationTime, email, href, avatar_key, avatar_value, children }) {

  return (
    <article className={styles.article}>
      {children ? children : (<>
        <div className={styles.module}>
          {module && (
            <Link href={{ pathname: '/posts/list', query: { module } }}>
              {module}
            </Link>
          )}
        </div>
        <h2 className={styles.title}>
          <Link href={href || '/posts/' + id}>
            {title}
          </Link>
        </h2>
        <div className={styles.meta}>
           <span className={styles.author}>
            <Avatar size={30} name={authorName} alt="Photo" mail={email} className={styles.avatar} draggable={false} {...{ [avatar_key] : avatar_value }} />
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
