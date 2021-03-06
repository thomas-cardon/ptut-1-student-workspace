import dynamic from 'next/dynamic';

import { usePost } from '../../lib/hooks';
import withSession from "../../lib/session";

const Editor = dynamic(() => import("../../components/Editor"), { ssr: false });
import UserLayout from '../../components/UserLayout';
import Title from '../../components/Title';

export default function ReadPostPage({ user, postId }) {
  const { data : post } = usePost(postId);

  let content = <Title>Chargement...</Title>;

  if (post) {
    try {
      let postContent = JSON.parse(post.content);

      content = (<>
        <h1 className={'title'} style={{ marginBottom: '1em' }}>
          {post.title}
        </h1>
        <Editor readOnly={true} data={postContent} />
      </>);
    }
    catch(error) {
      console.error(error);

      content = (<>
        <Title appendGradient="l'emploi du temps" style={{ marginBottom: '1em' }}>
          {post.title}
        </Title>
        <h3 className={'subtitle'}>Une erreur s'est produite lors de la lecture du post.</h3>
        <pre>
          <code>{error.toString()}</code>
        </pre>
      </>);
    }
  }

  return (
    <UserLayout user={user} flex={true}>
      {content}
    </UserLayout>
  );
};

export const getServerSideProps = withSession(async function ({ req, res, query, params }) {
  const user = req.session.get('user');

  if (!user) {
    res.setHeader('location', '/login');
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }

  return {
    props: { user: req.session.get('user'), ...query, ...params },
  };
});
