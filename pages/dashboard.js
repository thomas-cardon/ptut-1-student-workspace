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
      <CardList>
        {posts.filter(x => x.isHomework).length > 0 && (
          <Card>
            <span className="title">Devoirs à faire</span>
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
          </Card>
        )}
        {posts.filter(x => !x.isHomework).length > 0 && (
          <Card>
            <span className="title">Derniers posts</span>
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
          </Card>
        )}

      </CardList>
    </>);
  }

  return (
    <UserLayout user={user} flex={true}>
      <Title appendGradient={user.firstName + ' !'}>
        Salut,
      </Title>
      <p className={`group ${darkModeActive ? 'group-dark' : ''}`}>{user ? (user?.group?.name || 'Groupe inconnu') : 'Chargement'}</p>

      <style jsx global>{`
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

        .group {
          font-family: "Raleway";
          font-weight: 400;
          text-align: left;
        }

        .group-dark {
          color: #FAFAFA;
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
