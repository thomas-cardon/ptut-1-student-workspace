import UserLayout from '../components/UserLayout';
import Title from '../components/Title';

import CardList from '../components/CardList';
import Card from '../components/Card';
import Homework from '../components/Homework';

import Link from '../components/Link';

import useServiceWorker from '../lib/workers';

import { usePosts, useNextCourse } from '../lib/hooks';
import withSession from "../lib/session";

import { useDarkMode } from 'next-dark-mode';

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function Dashboard({ user }) {
  const { darkModeActive } = useDarkMode();
  useServiceWorker(user);

  return (
    <UserLayout user={user} flex={true}>
      <Title appendGradient={user.firstName + ' !'} subtitle={' — ' + (user?.group?.name || 'Groupe inconnu')}>
        Salut,
      </Title>
      <div className="block">
        <CardList className="links">
            <Link href="https://outlook.office.com/owa/?realm=etu.univ-amu.fr&path=/mail" target="_blank">
              <Card className="link">
                <div>
                  <img srcSet="/assets/dashboard/mail.svg" />
                  <span>OUTLOOK</span>
                </div>
              </Card>
            </Link>
            <Link href="https://ident.univ-amu.fr/cas/login?service=https://ametice.univ-amu.fr/login/index.php" target="_blank">
              <Card className="link">
                <div>
                  <img srcSet="/assets/dashboard/folder.svg" />
                  <span>AMETICE</span>
                </div>
              </Card>
            </Link>
            <Link href="https://ent.univ-amu.fr/mdw/#!etatCivilView" target="_blank">
              <Card className="link">
                <div>
                  <img srcSet="/assets/dashboard/student.svg" />
                  <span>MON DOSSIER</span>
                </div>
              </Card>
            </Link>
            <Link href="https://ent.univ-amu.fr/" target="_blank">
              <Card className="link">
                <div>
                  <img srcSet="/assets/dashboard/amu.svg" />
                  <span>ENT</span>
                </div>
              </Card>
            </Link>
        </CardList>
        {/*<Homework author="Thomas Cardon" timestamp="1618837526" subjectId="M2103" name="Réseaux" userId={1} isDone={1} groupId={47} description="Finir le TP4 pour le TD Noté prévu Samedi" />*/}
      </div>
      <style jsx global>{`
        .links > * {
          flex: 1 1 0;
        }

        .block {
          padding: 1em 0;
        }

        .block .title {
          width: fit-content;
          margin: 0 0 1em;
          border-bottom: var(--color-primary-200) solid 2px;

          color: var(--color-primary-200);
          font-family: 'Nunito';
          font-weight: lighter;
          font-size: xx-large;
        }

        @media (max-width:700px)  {
          .block .title {
            margin: auto auto;
          }
        }

        .link {
          background-color: var(--color-primary-600);
          opacity: 0.9;
          transition: all 0.2s ease;

          border-color: rgba(0, 0, 0, 0.25);
          border-radius: 10px;
          border-bottom-style: solid;
          border-bottom-width: .5em;
        }

        .link span {
          font-family: 'Nunito';
          font-weight: bolder;
          font-style: italic;
          text-shadow: 0px 0px 5px black;

          color: white;
        }

        .link > div {
          width: 100%;
          margin: auto auto;

          display: flex;
          flex-direction: column;
        }

        .link:hover {
          opacity: 1;
          transform: scale(1.015, 1.015);
          cursor: pointer;
        }

        .link img {
          width: 100px !important;
          height: auto;
          margin: auto;
        }
      `}</style>
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
