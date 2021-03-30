import UserLayout from '../components/UserLayout';
import Title from '../components/Title';

import CardList from '../components/CardList';
import Card from '../components/Card';

import Link from '../components/Link';

import useServiceWorker from '../lib/workers';

import { usePosts, useNextCourse } from '../lib/hooks';
import withSession from "../lib/session";

import { HiArrowNarrowRight } from "react-icons/hi";
import { useDarkMode } from 'next-dark-mode';

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function Dashboard({ user }) {
  useServiceWorker(user);

  const { darkModeActive } = useDarkMode();
  const { data : posts } = usePosts(user);
  const { data : nextCourse } = useNextCourse();

  let content = <Title>Chargement</Title>;

  // Indication présentiel ou distanciel ce serait bien dans l'EDT
  if (posts) {
    content = (<>
      <Title style={{textAlign: "center"}} appendGradient={'AMU :'}>
        Mes outils
      </Title>
      <CardList className="links">
          <Card>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <img className="invert" srcset="/assets/dashboard/mail.svg" />
              <span className="subtitle">MESSAGERIE</span>
            </div>
          </Card>
          <Card>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <img srcset="/assets/dashboard/folder.svg" />
              <span className="subtitle">AMETICE</span>
            </div>
          </Card>
          <Card>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <img srcset="/assets/dashboard/student.svg" />
              <span className="subtitle">DOSSIER ETUDIANT</span>
            </div>
          </Card>
          <Card>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <img srcset="/assets/dashboard/amu.svg" />
              <span className="subtitle">ENT</span>
            </div>
          </Card>
      </CardList>
    </>);
  }

  return (
    <UserLayout user={user} flex={true}>
      <Title appendGradient={user.firstName + ' !'}>
        Salut,
      </Title>
      <p className="group">{user ? (user?.group?.name || 'Groupe inconnu') : 'Chargement'}</p>

      <style jsx global>{`
        .links > div {
          background-color: #feca57;
          border-left: solid 10px ${darkModeActive ? 'white' : 'black'};
          color: ${darkModeActive ? 'white' : 'black'};
          transition: all 0.2s ease;
        }

        .links > div:hover {
          opacity: 1;
          transform: scale(1.1, 1.1);
          cursor: pointer;
        }

        .links img {
          width: 100px !important;
          height: auto;
          margin: auto;
        }

        .invert {
          ${!darkModeActive ? 'filter: invert(1);' : ''}
        }

        .group {
          font-family: "Raleway";
          font-weight: 400;
          text-align: left;
        }
      `}</style>
      {content}
    </UserLayout>
  );
};

export const getServerSideProps = withSession(async function ({ req, res }) {
  const user = req.session.get('user');

  if (!user) {
    res.setHeader('location', '/login');
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }

  return {
    props: { user: req.session.get('user') },
  };
});
