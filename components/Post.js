import Link from 'next/link';

import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import styles from "./Post.module.css";

export default function Post({ id, title, content, module, authorName, creationTime, avatar }) {
  return (
    <article className={styles.article}>
      <div className={styles.module}>
        {module && (
          <Link href={{ pathname: '/posts/list', query: { module } }}>
            <a>{module}</a>
          </Link>
        )}
      </div>
      <h2 className={styles.title}>
        <Link href={'/posts/' + id}>
          <a>{title}</a>
        </Link>
      </h2>
      <div className={styles.meta}>
         <span className={styles.author}>
            <span className={styles.avatar}>
               <img src={avatar} width="30" height="30" alt={authorName} className={styles.avatarImage} />
            </span>
            {authorName}
         </span>
         <span className={styles.date}>{format(creationTime, 'd MMMM yyyy', { locale: fr })}</span>
      </div>
    </article>
  );
}
