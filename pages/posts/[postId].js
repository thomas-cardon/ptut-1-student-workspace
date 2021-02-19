import ReactMarkdown from 'react-markdown';
import UserLayout from '../../components/UserLayout';

import use from '../../lib/use';
import { useUser } from '../../lib/useUser';

function Page({ postId }) {
  const { data } = use({ url: '/api/posts/' + postId, redirectOnError: '/error' });

  let content = <h1 className={'title'}>Chargement...</h1>;

  console.dir(data);

  if (data) content = (<>
    <h1 className={'title'}>
      {data.post.title}
    </h1>
    <ReactMarkdown allowDangerousHtml={true}>
      {data.post.content}
    </ReactMarkdown>
  </>);

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
