import UserLayout from '../components/UserLayout';
import Title from '../components/Title';
import Chat from '../components/Chat';

import Link from 'next/link';

import useServiceWorker from '../lib/workers';

import { usePosts } from '../lib/hooks';
import withSession from "../lib/session";

import { HiArrowNarrowRight } from "react-icons/hi";
import { useDarkMode } from 'next-dark-mode';

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function Dashboard({ user }) {
  useServiceWorker(user);

  const { darkModeActive } = useDarkMode();
  const { data : posts } = usePosts();

  let content = <Title>Chargement</Title>;

  if (posts) {
    content = (
      <div className="cards">
        {true && (
          <div className={`card ${darkModeActive ? 'dark' : ''} card-xl chat`}>
            <Chat clientId={"user-" + user.userId + '-' + Math.floor(Math.random() * Math.floor(10000))} />
          </div>
        )}
        {posts.filter(x => x.isHomework).length > 0 && (
          <div className={`card ${darkModeActive ? 'dark' : ''}`}>
            <h1>Devoirs à faire</h1>
            <ul className="homework">
              {posts.filter(x => x.isHomework).map((post, i) => <li key={i}>
                <Link href={"/posts/" + post.id}>
                  <a>
                    <p>Pour le {format(Date.parse(post.homeworkDate), 'd MMMM yyyy à HH:mm', { locale: fr })}</p>
                    <hr />
                    <HiArrowNarrowRight style={{ verticalAlign: 'middle' }}/>
                    <span>{post.title}</span>
                    <p>
                      <i>({post.moduleName} — {post.firstName + ' ' + post.lastName})</i>
                    </p>
                  </a>
                </Link>
              </li>)}
            </ul>
          </div>
        )}
        {posts.filter(x => !x.isHomework).length > 0 && (
          <div className={`card ${darkModeActive ? 'dark' : ''}`}>
            <h1>Derniers posts</h1>
            <ul>
              {posts.filter(x => !x.isHomework).map((post, i) => <li key={i}>
                <Link href={"/posts/" + post.id}>
                  <a>
                    <HiArrowNarrowRight style={{ verticalAlign: 'middle' }}/>
                    <span>{post.title}</span>
                  </a>
                </Link>
              </li>)}
            </ul>
          </div>
        )}

      </div>
    );
  }

  return (
    <UserLayout user={user} flex={true}>
      <Title appendGradient={user.firstName + ' !'}>
        Salut,
      </Title>
      <code>{user ? (user?.group?.name || 'Groupe inconnu') : 'Chargement'}</code>

      <style jsx global>{`
        .cards {
          margin: 3em;

          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-auto-rows: auto;
          grid-gap: 1rem;
        }

        .card {
          border-radius: 5px;
          box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
          transition: 0.3s;
          padding: 1em;
        }

        .dark {
          background-color: #1E1E1E;
        }

        .card-lg {
          min-width: 20vw;
          min-height: 30vh;
        }

        .card-xl {
          min-width: 30vw;
          min-height: 40vh;
        }

        .card:hover {
          box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
        }

        .card h3 {
          font-family: 'Lato', system-ui;
          font-weight: 300;

          text-align: center;
        }

        ul {
          margin-left: 0;
          padding-left: 0;
        }

        ul.homework p {
          margin: 0;
        }

        li {
          list-style: none;
          text-align: left;
        }

        li span {
          display: inline-block;
        }

        li span:first-letter {
          text-transform: uppercase;
        }

        li a > * {
          margin-right: .5em;
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
