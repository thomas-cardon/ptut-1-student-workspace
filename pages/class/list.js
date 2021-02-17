import useSWR from 'swr';
import useUser from '../../lib/useUser';
import fetcher from '../../lib/fetchJson';

import UserLayout from '../../components/UserLayout';

function Class({ id, name }) {
  return (
    <article style={{ border: 'darkgrey solid 1px', borderRadius: '8px', padding: '2em', 'marginBottom': '2em' }}>
      <h1>{name}</h1><small>— #{id}</small>
      <p>
        <code>

        </code>
      </p>
    </article>
  )
}

export default function Page({ props }) {
  const { user } = useUser({ redirectNotAuthorized: '/login', redirectOnError: '/error' }); /* Redirection si l'utilisateur n'est pas connecté */
  const { data, error } = useSWR('/api/class/list', fetcher);

  let content;

  console.dir(data);

  if (!user || !data) content = <h2 className={'title'}>Chargement</h2>;
  else if (error) {
    content = <h2 className={'title'}>Erreur !</h2>;
    console.error(error);
  }
  else if (data.modules.length == 0) content = <h2 className={'title'}>Aucun cours disponible</h2>;
  else content = data.modules.map((module, i) => <Class id={module.moduleId} key={'module-' + module.id} name={module.name}></Class>);

  return (
    <UserLayout user={user} flex={true}>
      <h1 className={'title'}>
        Cours enregistrés
      </h1>
      <div className={'grid'}>
        {content}
      </div>
    </UserLayout>
  );
};
