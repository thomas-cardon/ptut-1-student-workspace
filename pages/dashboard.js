import UserLayout from '../components/UserLayout';
import Link from 'next/link';

import useServiceWorker from '../lib/workers';

import useSWR from 'swr';
import fetcher from '../lib/fetchJson';
import withSession from "../lib/session";

import { HiArrowNarrowRight } from "react-icons/hi";
import { useDarkMode } from 'next-dark-mode';

export default function Dashboard({ user }) {
  useServiceWorker();

  const { darkModeActive } = useDarkMode();
  const { data : posts, error } = useSWR('/api/posts/recent', fetcher);

  let content = <h1 className={'title'}>Chargement</h1>;

  if (error) content = <>
    <h3 className={'subtitle'}>Chargement</h3>
    <pre>
      <code>{error.toString()}</code>
    </pre>
  </>;
  else if (posts) {
    content = (
      <div className="cards">
        {true && (
          <div className={`card ${darkModeActive ? 'dark' : ''} card-xl chat`}>
            <h3>Chat:&nbsp;<code style={{ color: 'red' }}>global</code> (Placeholder)</h3>
            <textarea readOnly></textarea>
            <div style={{ display: 'flex', width: '100%' }}>
              <input type="text" placeholder="Ecrire un message" />
              <button>Envoyer</button>
            </div>
          </div>
        )}

        {posts && (
          <div className={`card ${darkModeActive ? 'dark' : ''}`}>
            <h3>Derniers posts</h3>
            <ul>
              {posts.data.map((post, i) => <li key={i}>
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
      <h1 className={'title'}>
        Salut, <span className={'gradient'}>{user.firstName}</span> !
      </h1>
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
          font-family: 'Lato';
          font-weight: 300;

          text-align: center;
        }

        ul {
          margin-left: 0;
          padding-left: 0;
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

        .chat textarea {
          width: 100%;
          height: 70%;
          margin: 0px;
          padding: 0px;
          outline: 0;
          border: 0;
          border-radius: 8px;
          background-color: #353535;
          resize: none;
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
