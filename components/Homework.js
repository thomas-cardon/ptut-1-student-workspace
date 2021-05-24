import { useState, useEffect } from 'react';
import Loader from 'react-loader-spinner';

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import useSWR from 'swr';
import { fetcher } from '../lib/hooks';

import { FormButton, ButtonGroup } from '../components/FormFields';
import Link from '../components/Link';

import styles from './Homework.module.css';

export default function Homework({ user, groupId }) {
  const { data, error } = useSWR('/api/homework', fetcher);

  const [day, setDay] = useState(0);
  const [homework, setHomework] = useState({});

  useEffect(() => {
    if (!data || error) return;

    let h = {};

    for (let i = 0; i < data.length; i++) {
      let date = format(new Date(data[i].date), 'EEEE dd LLL', { locale: fr });
      if (h[date]) h[date].push(data[i]);
      else h[date] = [ data[i] ];
    }

    setHomework(h);
  }, [data]);

  if (error) {
    console.error(error);
    return <></>;
  }

  return (
    <div className={styles.content}>
      {data && user?.group ? (<>
        <div className="buttons">
          <ButtonGroup style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <FormButton disabled={day <= 0} onClick={() => setDay(day - 1)}>{"«"}</FormButton>
            <Link href="/homework/add">
              <FormButton disabled={user.userType === 0 && !user.delegate}>{"+"}</FormButton>
            </Link>
            <FormButton disabled={day >= Object.entries(homework).length - 1} onClick={() => setDay(day + 1)}>{"»"}</FormButton>
          </ButtonGroup>
        </div>
        <h1>Travail à faire</h1>
        {data.length === 0 ? (
          <div>
            <h5 className={styles.title}>
              <span className={styles.date}>A ce jour</span>
            </h5>
            <p style={{ padding: '0.5em' }}>
              Vous n'avez pas de travail à faire.
              <br />
              Peut-être devriez vous demander à votre délégué de les ajouter ?
            </p>
          </div>
        ) : (
          <div>
            <h5 className={styles.title}>
              <span>Pour le&nbsp;</span>
              <span className={styles.date}>{Object.entries(homework)[day][0]}</span>
            </h5>
            {Object.entries(homework)[day][1].map((element, i) => (<div key={Object.entries(homework)[day][0] + '-' + i}>
              <h4>{element.module} {element.name}</h4>
              <h6>• {element.content}</h6>
            </div>))}
          </div>
        )}
      </>) : <Loader type="Oval" color="var(--color-accent)" height="2rem" width="100%" style={{ padding: '5rem' }} />}
  </div>);
};
