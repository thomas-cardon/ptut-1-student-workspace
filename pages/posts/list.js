import Link from 'next/link';

import UserLayout from '../../components/UserLayout';
import Highlight from "../../components/Highlight";
import Title from "../../components/Title";
import Post from "../../components/Post";

import { usePosts, useAvatar } from '../../lib/hooks';
import withSession from "../../lib/session";

export default function Posts({ user, module }) {
  const { data : posts } = usePosts(user, 0, module);

  let content = <h2 className={'title'}>Chargement</h2>;

  if (posts && posts?.length === 0) content = <h2 className={'title'}>Aucun post disponible</h2>;
  else if (posts) content = posts.map((post, i) => <Post id={post.id} key={'post-' + post.id} authorName={post.firstName + ' ' + post.lastName} creationTime={new Date(post.creation_time)} avatar={useAvatar(user)} {...post}></Post>);

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
