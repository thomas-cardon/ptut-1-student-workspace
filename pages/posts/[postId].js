import dynamic from 'next/dynamic';

import use from '../../lib/use';
import { useUser } from '../../lib/useUser';

const Editor = dynamic(() => import("../../components/Editor"), { ssr: false });
import UserLayout from '../../components/UserLayout';

function Page({ postId }) {
  const { data } = use({ url: '/api/posts/' + postId, redirectOnError: '/error' });

  let content = <h1 className={'title'}>Chargement...</h1>;

  if (data) {
    try {
      let postContent = JSON.parse(data.post.content);

      content = (<>
        <h1 className={'title'} style={{ marginBottom: '1em' }}>
          {data.post.title}
        </h1>
        <Editor readOnly={true} data={postContent} />
      </>);
    }
    catch(error) {
      console.error(error);
    }
  }

  return (
    <>
      <style jsx>{`
        .title {
          color: blue;
        }
      `}</style>
      <UserLayout flex={true}>
        {content}
      </UserLayout>
    </>
  );
};

export function getServerSideProps(ctx) {
  return { props: ctx.query };
}

export default Page;
