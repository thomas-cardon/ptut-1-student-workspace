import useSWR from 'swr';
import fetcher from '../../lib/fetchJson';
import withSession from "../../lib/session";

import UserLayout from '../../components/UserLayout';

function Class({ id, name }) {
  return (
    <li>{name}<small>— #{id}</small></li>
  )
}

export default function ClassListPage({ user }) {
  const { data, error } = useSWR('/api/class/list', fetcher);

  let content;

  if (!data) content = <h2 className={'title'}>Chargement</h2>;
  else if (error) {
    content = <h2 className={'title'}>Erreur !</h2>;
    console.error(error);
  }
  else if (data.modules.length == 0) content = <h2 className={'title'}>Aucun cours disponible</h2>;
  else content = data.modules.map((module, i) => <Class id={module.module} key={'module-' + module.module} name={module.name}></Class>);

  return (
    <UserLayout user={user} flex={true}>
      <h1 className={'title'}>
        Cours enregistrés
      </h1>
      <div className={'grid'}>
        <ul>
          {content}
        </ul>
      </div>
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
