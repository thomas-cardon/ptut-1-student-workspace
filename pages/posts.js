import useSWR from 'swr';
import useUser from '../lib/useUser';
import fetcher from '../lib/fetchJson';

import UserLayout from '../components/UserLayout';

function Post({ id, title, content, author, date }) {
  return (
    <article style={{ border: 'darkgrey solid 1px', borderRadius: '8px', padding: '2em', 'marginBottom': '2em' }}>
      <h1>{title}</h1><small>— #{id}</small>
      <p>
        <code>
          {content}
        </code>
      </p>
    </article>
  )
}

export default function Posts({ props }) {
  const { user } = useUser({ redirectNotAuthorized: '/login', redirectOnError: '/error' }); /* Redirection si l'utilisateur n'est pas connecté */
  const { data, error } = useSWR('/api/posts/recent', fetcher);

  let content;

  if (!user || !data) content = <h2 className={'title'}>Chargement</h2>;
  else if (error) {
    content = <h2 className={'title'}>Erreur !</h2>;
    console.error(error);
  }
  else if (data.data.length == 0) content = <h2 className={'title'}>Aucun post disponible</h2>;
  else content = data.data.map((post, i) => <Post id={post.id} key={'post-' + post.id} title={post.title} content={post.content} author={post.author} date={post.date}></Post>);

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
