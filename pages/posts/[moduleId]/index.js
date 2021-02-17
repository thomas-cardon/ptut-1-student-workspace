import useUser from '../../../lib/useUser';
import useServiceWorker from '../../../lib/workers';

import UserLayout from '../../../components/UserLayout';

import useSWR from 'swr';
import fetch from 'isomorphic-unfetch';
const fetcher = url => fetch(url).then(r => r.json());

function Page({ moduleId }) {
  useServiceWorker();

  const { user } = useUser({ redirectNotAuthorized: '/login', redirectOnError: '/error' }); /* Redirection si l'utilisateur n'est pas connecté */
  const { data } = useSWR('/api/class/' + moduleId, fetcher);
  const { postsData } = useSWR('/api/posts/by-module/' + moduleId, fetcher);

  let content = <h1 className={'title'}>Chargement...</h1>;
  let posts = <span>Chargement des posts</span>;

  console.dir(data);
  console.dir(postsData);

  if (user && data) content = (<>
    <h1 className={'title'}>
      Cours <span style={{ color: '#D56A53' }}>{moduleId.toUpperCase()}</span>
    </h1>
    <p>{data.success && data.module.name}</p>
    <p>{(!data.success && data.error === "Not found") && "Le cours n'existe pas!"}</p>
  </>);

  if (data?.success && postsData)
  posts = postsData.data.map((post, i) => <Post id={post.id} key={'post-' + post.id} title={post.title} content={post.content} author={post.author} date={post.date}></Post>);

  return (
    <UserLayout user={user} flex={true}>
      {content}
      {data?.success && posts}
    </UserLayout>
  );
};

export function getServerSideProps(ctx) {
  return { props: ctx.query };
}

export default Page;
