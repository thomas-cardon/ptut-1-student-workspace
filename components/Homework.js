import { useState, useEffect } from 'react';
import Loader from 'react-loader-spinner';

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import useSWR from 'swr';
import { fetcher } from '../lib/hooks';
import { useRouter } from 'next/router';
import { useToasts } from 'react-toast-notifications';

import { FormButton, ButtonGroup } from '../components/FormFields';
import Link from '../components/Link';
import Table from '../components/Table';

import {
  Menu,
  Item,
  Separator,
  Submenu,
  useContextMenu
} from "react-contexify";

import "react-contexify/dist/ReactContexify.css";
import styles from './Homework.module.css';

const MENU_ID = 'HOMEWORK-EDIT';

export default function Homework({ user, groupId }) {
  const { data, error } = useSWR('/api/homework', fetcher);
  const { addToast } = useToasts();
  const router = useRouter();

  const [day, setDay] = useState(0);
  const [homework, setHomework] = useState({});

  const { show } = useContextMenu({ id: MENU_ID });

  function handleItemClick({ event, props, triggerEvent, data }){
    console.log(event, props, triggerEvent, data);
  }

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

  function handleItemClick({ event, props, triggerEvent, data }){
    switch (event.currentTarget.id) {
      case "edit":
        router.push('/homework/edit');
        break;
      case "remove":
        if (!confirm('Voulez-vous vraiment supprimer ce devoir ?')) return;

        fetch(location.protocol + '//' + location.host + '/api/homework', {
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id: props.id }),
          method: 'DELETE'
        }).then(() => addToast(`Suppression réussie du devoir #${props.id}`, { appearance: 'success' }))
          .catch(error => {
            console.error(error);
            addToast(error.message ? ('Erreur: ' + error.message) : "Une erreur s'est produite.", { appearance: 'error' });
          });
        break;
    }
  }

  return (
    <div className={styles.content}>
      <Menu id={MENU_ID}>
        <Item id="edit" disabled="true" onClick={handleItemClick}>📝 Editer </Item>
        <Item id="remove" onClick={handleItemClick}>&#x274C; Supprimer</Item>
      </Menu>
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
        {data.length === 0 || !Object.entries(homework)[day] ? (
          <div>
            <h5 className={styles.title}>
              <span className={styles.date}>A ce jour</span>
            </h5>
            <p style={{ padding: '0.5em' }}>
            {user?.group?.name === 'Professeur' ? (
              <>
                Les élèves n'ont pas de travail aujourd'hui.
                <br />
                Peut-être devriez vous en ajouter ?
              </>
            ) : (
              <>
                Vous n'avez pas de travail à faire.
                <br />
                Peut-être devriez vous demander à votre délégué de les ajouter ?
              </>
            )}
            </p>
          </div>
        ) : (<>
            <h5 className={styles.title}>
              <span>Pour le&nbsp;</span>
              <span className={styles.date}>{Object.entries(homework)[day][0]}</span>
            </h5>
            {Object.entries(homework)[day][1].map((element, i) => (<div onContextMenu={e => show(e, { props: { id: element.id } })} key={Object.entries(homework)[day][0] + '-' + i}>
              <div className={styles.bloc}>
                <h4>{element.module} {element.name}</h4>
                <h6>• {element.content}</h6>
              </div>
            </div>))}
          </>)}
      </>) : <Loader type="Oval" color="var(--color-accent)" height="2rem" width="100%" style={{ padding: '5rem' }} />}
  </div>);
};
