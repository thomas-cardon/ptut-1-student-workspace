import React, { useState, useEffect } from 'react';

import styles from './UpcomingClassCard.module.css';

import Card from './Card';

import Link from './Link';
import Button from './FormFields/FormButton';
import ButtonGroup from './FormFields/ButtonGroup';

import { HiDotsHorizontal, HiPencilAlt, HiArrowRight } from "react-icons/hi";

import { useADE, getCurrentCourse, getNextCourse } from '../lib/ade';
import { formatDistanceStrict, formatDistanceToNowStrict } from 'date-fns';
import { fr } from 'date-fns/locale';

import Skeleton from 'react-loading-skeleton';

const isServer = () => typeof window === `undefined`;

export default function UpcomingClassCard({ user }) {
  const [course, setCourse] = useState(null);
  const [current, setCurrent] = useState(false);

  if (!isServer()) {
    function exec() {
      if (!user) return;

      useADE(user)
      .then(calendar =>
        getCurrentCourse({ user, calendar })
        .then(course => {
          setCourse(course);
          if (!course) getNextCourse({ user, calendar }).then(course => {
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
    }, [user]);
  }

  return (
    <Card className={[styles.card, course === null ? '' : styles[current ? 'current' : 'next']].join(' ')}>
      {(<>
        <h1 className={styles.title}>{course ? `${!current ? '⏭️ ' : ''}${course.summary}` : <Skeleton />}</h1>
        <small><i>{course ? (course.description ? course.description.trim() : 'Sans description') : <Skeleton />}</i></small>
        <span><b>{course ? course?.location : <Skeleton />}</b></span>
        {course && <span style={{ color: current ? 'var(--color-accent)' : '#27ae60' }}>Démarr{current ? 'é' : 'e'} {formatDistanceToNowStrict(course.start, { addSuffix: true, locale: fr })}</span>}
        {course && <span style={{ color: current ? 'var(--color-accent)' : '#27ae60' }}>Durée: {formatDistanceStrict(course.start, course.end, { locale: fr })}</span>}

        <Link href={course?.meeting || '#'} target="_blank" className={styles.joinButton}>
          <Button is="success" icon={<HiArrowRight />} disabled={typeof course?.meeting === 'undefined'}>Rejoindre</Button>
        </Link>

        <div className={styles.buttons}>
          <Link href="/" /*href={"/course/notes/" + course.id}*/>
            <Button icon={<HiPencilAlt />} center={true}>Note</Button>
          </Link>
          <Link href="/" /*href={"/course/" + course.id}*/>
            <Button is="action" icon={<HiDotsHorizontal />}>Voir</Button>
          </Link>
        </div>
      </>)}
    </Card>
  );
};
