import Link from '../../components/Link';

import UserLayout from '../../components/UserLayout';
import Highlight from "../../components/Highlight";
import Title from "../../components/Title";
import Post from "../../components/Post";

import Button from '../../components/FormFields/FormButton';

import { HiPlusCircle } from "react-icons/hi";

import Loader from 'react-loader-spinner';

import { usePosts } from '../../lib/hooks';
import useUser from '../../lib/useUser';

export default function PostList() {
  const { user } = useUser({ redirectTo: '/login' });
  const { data : posts } = usePosts(user);

  let content = (<Post>
    <Loader type="Oval" color="var(--color-accent)" height="2em" width="100%" />
  </Post>);

  if (posts && posts?.length === 0) content = <h2 className={'title'}>Aucun post disponible</h2>;
  else if (posts) content = posts.map((post, i) => <Post id={post.id} key={'post-' + post.id} authorName={post.firstName + ' ' + post.lastName} creationTime={new Date(post.creation_time)} email={post.email} {...post}></Post>);

  return (
    <UserLayout user={user} flex={true} header={<>
      <Title appendGradient="informations" button={user?.userType > 0 || user?.delegate === true ?
        <Link href="/posts/create">
          <Button is="action" icon={<HiPlusCircle />}>Ajouter</Button>
        </Link> : <></>}>
        Dernières
      </Title>
      </>}>

      {/*module && (
        <Highlight title="Le saviez-vous?">
          <div>
            Cliquez sur le titre d'un post pour y accéder. Ou retournez à la&nbsp;
            <Link href="/posts/list" style={{ color: 'red' }}>
              liste sans filtre
            </Link>.
          </div>
        </Highlight>
      )*/}
      {content}
    </UserLayout>
  );
};
