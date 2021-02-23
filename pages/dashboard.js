import UserLayout from '../components/UserLayout';
import Link from 'next/link';

import useServiceWorker from '../lib/workers';

import useSWR from 'swr';
import fetcher from '../lib/fetchJson';
import withSession from "../lib/session";

import { HiArrowNarrowRight } from "react-icons/hi";

export default function Dashboard({ user }) {
  useServiceWorker();

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
        {posts && (
          <div className="card">
            <h3 className="card-title">Derniers posts</h3>
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
        {true && (
          <div className="card cardd-lg">
            <h3 className="card-title">Dernières alertes</h3>
            <ul>
              {[].map((a, i) => <li key={i}>
                <HiArrowNarrowRight style={{ verticalAlign: 'middle' }}/>
                <span>{a.message}</span>
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
          margin-top: 3em;

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

        .card:hover {
          box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
        }

        .card-title {
          font-family: 'Lato';
          font-weight: 300;
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
