import Link from 'next/link';

import UserLayout from '../../components/UserLayout';
import Highlight from "../../components/Highlight";
import Title from "../../components/Title";
import Post from "../../components/Post";

import { getAvatar } from '../../lib/useUser';

import useSWR from 'swr';
import fetcher from '../../lib/fetchJson';
import withSession from "../../lib/session";

export default function Posts({ user, module }) {
  const { data, error } = module ? useSWR(`/api/posts/recent?module=${module}`, fetcher) : useSWR('/api/posts/recent', fetcher);

  let content;

  if (!data) content = <h2 className={'title'}>Chargement</h2>;
  else if (error) {
    content = <Title>Erreur !</Title>;
    console.error(error);
  }
  else if (!data.data) content = <h2 className={'title'}>Aucun post disponible</h2>;
  else content = data.data.map((post, i) => <Post id={post.id} key={'post-' + post.id} authorName={post.firstName + ' ' + post.lastName} creationTime={new Date(post.creation_time)} avatar={getAvatar(user)} {...post}></Post>);

  return (
    <UserLayout user={user} flex={true}>
      <Title appendGradient="posts">
        Derniers
      </Title>
      {user.userType !== 0 && (
        <h3 className={'subtitle'}>
          <Link href="/posts/create">
            <a>Ajouter</a>
          </Link>...
        </h3>
      )}
      <div className={'grid'}>
        <Highlight title={'Le saviez-vous?'}>
          Cliquez sur le titre d'un post pour y accéder. Ou retournez à la&nbsp;
          <Link href="/posts/list">
            <a>liste sans filtre</a>
          </Link>.
        </Highlight>
        {content}
      </div>
    </UserLayout>
  );
};

export const getServerSideProps = withSession(async function ({ req, res, query }) {
  const user = req.session.get('user');

  if (!user) {
    res.setHeader('location', '/login');
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }

  return {
    props: { user: req.session.get('user'), ...query },
  };
});
