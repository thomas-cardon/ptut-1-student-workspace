import ReactMarkdown from 'react-markdown';
import { format, formatDistance, formatRelative, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';

import styles from "./Post.module.css";

export default function Post({ id, title, content, author, creationTime }) {
  return (
    <article className={styles.article}>
      <div className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        <p>
          <small>— {formatRelative(creationTime, new Date(), { locale: fr })}</small>
        </p>
        <ReactMarkdown allowDangerousHtml={true}>
          {content}
        </ReactMarkdown>
      </div>
    </article>
  );
}
