import useUser from '../../lib/useUser';

import UserLayout from '../../components/UserLayout';
import Title from '../../components/Title';

import Loader from 'react-loader-spinner';

export default function CoursePage({ id }) {
  const { user } = useUser({ redirectTo: '/login' });

  let content = <Loader type="Oval" color="var(--color-accent)" height="2em" width="100%" />;

  return (
    <UserLayout user={user} title="Cours actuel" flex={true} header={<>
       <Title appendGradient="actuel">
         Votre cours
       </Title>
       <p>#{id}</p>
       <p>Cette page est en cours de création. Revenez plus tard.</p>
     </>}>
     </UserLayout>);
};

export function getServerSideProps({ req, res, query, params }) {
  return { props: { id: query.id } };
};
