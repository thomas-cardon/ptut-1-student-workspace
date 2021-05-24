import useUser from '../../../lib/useUser';

import Title from '../../../components/Title';
import Button from '../../../components/FormFields/FormButton';

import UserLayout from '../../../components/UserLayout';

import Loader from 'react-loader-spinner';

import { HiPencilAlt } from "react-icons/hi";

export default function CoursePage({ id }) {
  const { user } = useUser({ redirectTo: '/login' });

  let content = <Loader type="Oval" color="var(--color-accent)" height="2em" width="100%" />;

  return (
    <UserLayout user={user} title="Cours actuel" flex={true} header={<>
       <Title appendGradient="actuel">
         Créer une note pour le cours
       </Title>
     </>}>
     </UserLayout>);
};

export function getServerSideProps({ req, res, query, params }) {
  return { props: { id: query.id } };
};
