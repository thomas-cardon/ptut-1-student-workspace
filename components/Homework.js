import * as styles from './Homework.module.css';
import { useDarkMode } from 'next-dark-mode';

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function Homework({ timestamp, description, subjectId, name, isDone, userId, groupId }) {
  const { darkModeActive } = useDarkMode();

  return (
    <div className={styles.content}>
      <h1>Travail à faire :</h1>
      <h5 className={styles.title}>
        <span>Pour le&nbsp;</span>
        <span className={styles.module}>{format(new Date(timestamp * 1000), 'EEEE dd LLL', { locale: fr })}</span>
      </h5>
      <h4>{subjectId + " " + name}</h4>
      <h5>{description} {isDone}</h5>
    </div>
  );
};
