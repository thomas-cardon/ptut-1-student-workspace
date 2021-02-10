import useSWR from 'swr';
import useUser from '../lib/useUser';
import fetcher from '../lib/fetchJson';

import BasicLayout from '../components/BasicLayout';

function Post({ id, title, content, author, date }) {
  return (
    <article>
      <h1>{title}</h1><small>— #{id}</small>
      <pre>
        <code>
          {content}
        </code>
      </pre>
    </article>
  )
}

export default function Posts({ props }) {
  const { user } = useUser({ redirectNotAuthorized: '/login', redirectOnError: '/error' }); /* Redirection si l'utilisateur n'est pas connecté */
  const { data, error } = useSWR('/api/posts/recent', fetcher)

  if (!user) return <div>Loading...</div>
  if (error || !data?.success) return <div>{error || 'failed to load'}</div>;

  return (
    <BasicLayout>
      <h1 className={'title'}>
        Derniers posts
      </h1>
      <div style={{ display: 'flex', flexDirection: 'column', width: '70%' }}>
        {data.data.map((post, i) => <Post id={post.id} title={post.title} content={post.content} author={post.author} date={post.date}></Post>)}
      </div>
    </BasicLayout>
  );
};
