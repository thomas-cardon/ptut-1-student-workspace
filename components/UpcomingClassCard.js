import React, { useState, useEffect } from 'react';

import styles from './UpcomingClassCard.module.css';

import Card from './Card';
import Loader from 'react-loader-spinner';

import Link from './Link';
import Button from './FormFields/FormButton';
import ButtonGroup from './FormFields/ButtonGroup';

import { HiDotsHorizontal, HiPencilAlt, HiArrowRight } from "react-icons/hi";

import { useADE, getClasses, getCurrentCourse, getNextCourse } from '../lib/ade';
import { formatDistance, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const isServer = () => typeof window === `undefined`;

export default function UpcomingClassCard({ user, year }) {
  const [course, setCourse] = useState(null);
  const [current, setCurrent] = useState(false);

  if (!isServer()) {
    function exec() {
      if (!user) return;

      useADE(user, { year })
      .then(calendar =>
        getCurrentCourse({ user, year, calendar })
        .then(course => {
          setCourse(course);
          if (!course) getNextCourse({ user, year, calendar }).then(course => {
            setCourse(course);
            setCurrent(false);
          }).catch(console.error);
          else setCurrent(true);
        }).catch(console.error))
      .catch(console.error);
    }

    useEffect(() => {
      exec();

      const intervalId = setInterval(exec, 30*60*1000);
      return () => clearInterval(intervalId);
    }, [user, year]);
  }

  return (
    <Card className={course === null ? '' : styles[current ? 'current' : 'next']} style={{ alignContent: 'center' }}>
      {!user?.isLoggedIn || !course ? <Loader type="Oval" color="var(--color-accent)" style={{ margin: 'auto auto' }} width="100%" /> : (<>
        <p className={styles.text}>
          <span className={styles.title}>{!current && '⏭️ '}{course.summary}</span>
          <span><i>{course.description ? course.description.trim() : 'Sans description'}</i></span>
          <span><b>{course.location}</b></span>
          <span style={{ color: current ? 'var(--color-accent)' : '#27ae60' }}>Démarr{current ? 'é' : 'e'} {formatDistanceToNow(course.start, { addSuffix: true, locale: fr })}</span>
          <span style={{ color: current ? 'var(--color-accent)' : '#27ae60' }}>Durée: {formatDistance(course.start, course.end, { locale: fr })}</span>
        </p>

        <div className="buttons">
          <Link href="/" /*href={"/course/notes/" + course.id}*/ style={{ flex: '1' }}>
            <Button icon={<HiPencilAlt />} center="true">Créer note</Button>
          </Link>
          <ButtonGroup style={{ display: 'flex' }}>
            <Link href="/" /*href={"/course/" + course.id}*/>
              <Button  is="action" icon={<HiDotsHorizontal />}>Voir</Button>
            </Link>
            <Link href={course?.meeting || '#'} target="_blank">
              <Button is="success" icon={<HiArrowRight />} disabled={typeof course.meeting === 'undefined'}>Rejoindre</Button>
            </Link>
          </ButtonGroup>
        </div>
      </>)}
    </Card>
  );
};
