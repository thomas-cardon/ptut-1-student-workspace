import React, { useEffect } from 'react';

import { useToasts } from 'react-toast-notifications';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import UserLayout from '../components/UserLayout';
import Title from '../components/Title';

import CardList from '../components/CardList';
import Card from '../components/Card';
import Homework from '../components/Homework';
import Highlight from '../components/Highlight';

import Link from '../components/Link';

import useUser from '../lib/useUser';
import useServiceWorker from '../lib/workers';
import { usePosts, useNextCourse } from '../lib/hooks';

export default function Dashboard() {
  const { user } = useUser({ redirectTo: '/login' });
  const { addToast } = useToasts();

  useServiceWorker(user);

  if (typeof window !== 'undefined')
    useEffect(() => {
      if (!window.location.search.includes("alert=")) return;

      addToast(decodeURIComponent(window.location.search.split("alert=")[1]), { appearance: 'warning' });
      history.pushState({}, null, window.location.origin);
    }, []);

  return (
    <UserLayout user={user} flex={true} title="Tableau de bord">
      <Title appendGradient={(user?.firstName || 'inconnu') + ' !'} subtitle={user?.isTeacher ? '' : (' — ' + (user?.group?.name || 'Groupe inconnu'))}>
        Salut,
      </Title>
      {user?.isTeacher && user?.userType === 0 && (
        <Highlight>
          <div style={{ color: 'var(--color-primary-600)' }}>
            Votre compte est en cours de <b>validation</b> par l'équipe de Student Workspace.
            <br />
            En attendant, vos actions seront réduites.
          </div>
        </Highlight>
      )}
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
        <Homework user={user} />
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
