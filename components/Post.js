import ReactMarkdown from 'react-markdown';
import { format, formatDistance, formatRelative, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';

import styles from "./Post.module.css";

export default function Post({ id, title, content, authorName, creationTime }) {
  return (
    <article className={styles.article}>
      <div className={styles.content}>
        <div className={styles.meta}>
          <div style={{ float: 'left' }}>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.date}>
              <small>— {formatRelative(creationTime, new Date(), { locale: fr })}</small>
            </p>
          </div>
          <div className={styles.profile}>
            <img src="https://placem.at/places?w=500&h=500&txt=" />
            {authorName}
          </div>
        </div>
        <ReactMarkdown allowDangerousHtml={true}>
          {content}
        </ReactMarkdown>
      </div>
    </article>
  );
}
