import UserLayout from '../../../components/UserLayout';
import Post from "../../../components/Post";

import { useUser, getAvatar } from '../../../lib/useUser';

import useSWR from 'swr';
import fetcher from '../../../lib/fetchJson';

export default function Page({ moduleId }) {
  const { user } = useUser({ redirectNotAuthorized: '/login', redirectOnError: '/error' }); /* Redirection si l'utilisateur n'est pas connecté */
  const { data, error } = useSWR('/api/posts/recent', fetcher);

  let content;

  if (!user || !data) content = <h2 className={'title'}>Chargement</h2>;
  else if (error) {
    content = <h2 className={'title'}>Erreur !</h2>;
    console.error(error);
  }
  else if (data.data.length == 0) content = <h2 className={'title'}>Aucun post disponible</h2>;
  else content = data.data.map((post, i) => <Post id={post.id} key={'post-' + post.id} authorName={post.firstName + ' ' + post.lastName} creationTime={new Date(post.creation_time)} avatar={getAvatar(user)} {...post}></Post>);

  console.dir(data);

  return (
    <UserLayout user={user} flex={true}>
      <h1 className={'title'}>
        Derniers posts
      </h1>
      <div className={'grid'}>
        {content}
      </div>
    </UserLayout>
  );
};


export function getServerSideProps(ctx) {
  return { props: ctx.query };
}
