import styles from './Homework.module.css';

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import useSWR from 'swr';
import { fetcher } from '../lib/hooks';

export default function Homework() {
  const { data, error } = useSWR('/api/homework', fetcher);

  const homework = {};

  if (error) {
    console.error(error);
    return <></>;
  }
  if (!data) return <></>;

  for (let i = 0; i < data.length; i++) {
    let date = format(data[i].timestamp, 'EEEE dd LLL', { locale: fr });
    if (homework[date]) homework[date].push(data[i]);
    else homework[date] = [ data[i] ];
  }

  return (
    <div className={styles.content}>
      <h1>Travail à faire</h1>
      {Object.entries(homework).map(data => (<div key={data[0]}>
        <h5 className={styles.title}>
          <span>Pour le&nbsp;</span>
          <span className={styles.date}>{data[0]}</span>
        </h5>
        {data[1].map((element, i) => (<div key={data[0] + '-' + i}>
          <h4>{element.module} {element.name}</h4>
          <h6>• {element.content}</h6>
        </div>))}
      </div>))}
    </div>
  );
};
