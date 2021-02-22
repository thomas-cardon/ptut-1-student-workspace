import Link from 'next/link';
import UserLayout from '../../components/UserLayout';

import useSWR from 'swr';
import fetcher from '../../lib/fetchJson';
import withSession from "../../lib/session";

import { useToasts } from 'react-toast-notifications';

export default function EditUserPage({ user, id }) {
  const { addToast } = useToasts();

  return (
    <UserLayout user={user} flex={true}>
      <h1 className={'title'}>
        Liste des <span className={'gradient'}>utilisateurs</span>
      </h1>
      <h3 className={'subtitle'}>
        <Link href='/users/edit'>
          <a>Ajouter...</a>
        </Link>
      </h3>
      <div className={'grid'}>
      </div>
    </UserLayout>
  );
};

export const getServerSideProps = withSession(async function ({ req, res, query }) {
  const user = req.session.get('user');

  if (!user || user.userType != 2) {
    res.setHeader('location', '/login');
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }

  return {
    props: { user: req.session.get('user'), ...query },
  };
});
