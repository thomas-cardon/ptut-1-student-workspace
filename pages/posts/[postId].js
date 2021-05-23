import dynamic from 'next/dynamic';
import Error from 'next/error';

import useUser from '../../lib/useUser';
import { usePost } from '../../lib/hooks';

const Editor = dynamic(() => import("../../components/Editor"), { ssr: false });
import UserLayout from '../../components/UserLayout';
import Title from '../../components/Title';

import Loader from 'react-loader-spinner';

export default function ReadPostPage({ postId }) {
  const { user } = useUser({ redirectTo: '/login' });
  const { data : post, error } = usePost(postId);

  let content = <Loader type="Oval" color="var(--color-accent)" height="2em" width="100%" />;

  if (error) return <Error statusCode={error.status} />;
  else if (post) {
    try {
      let postContent = JSON.parse(post.content);

      content = (<>
        <h1 className={'title'} style={{ marginBottom: '1em' }}>
          {post.title}
        </h1>
        <Editor readOnly={true} data={postContent} />
        <div style={{ width: '100%', borderRadius: '8px', backgroundColor: 'var(--color-primary-800)', padding: '1em', margin: '2em auto 0 auto' }}>
          Article posté le {new Date(post.creation_time).toLocaleDateString()} | par {post.authorFirstName} {post.authorLastName} - <em>{post.groupName}</em>
        </div>
      </>);
    }
    catch(error) {
      return <Error title={error} statusCode={500} />;
    }
  }

  return (
    <UserLayout user={user} title={post?.title} flex={true}>
      {content}
    </UserLayout>
  );
};

export function getServerSideProps({ req, res, query, params }) {
  return { props: { postId: query.postId } };
};
