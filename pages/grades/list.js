import { useRouter } from 'next/router';
import Link from 'next/link';

import UserLayout from '../../components/UserLayout';
import Table from '../../components/Table';

import {
  contextMenu,
  Menu,
  Item,
  Separator,
  Submenu
} from "react-contexify";

import useSWR from 'swr';
import fetcher from '../../lib/fetchJson';
import withSession from "../../lib/session";

import { useToasts } from 'react-toast-notifications';

export default function ClassListPage({ user }) {
  const { data, error } = useSWR('/api/grades/list', fetcher);
  const { addToast } = useToasts();
  const router = useRouter();

  const displayMenu = e => contextMenu.show({
    id: "grades",
    event: e,
    props: { id: e.currentTarget.id }
  });

  function handleItemClick({ event, props, data, triggerEvent }) {
    switch (event.currentTarget.id) {
      case "edit":
        break;
      case "remove":
        break;
    }
  }

  let content;

  if (!data) content = <h2 className={'title'}>Chargement</h2>;
  else if (error) {
    content = <h2 className={'title'}>Erreur !</h2>;
    console.error(error);
  }
  else if (data.grades.length == 0) content = <h2 className={'title'}>Aucune note disponible</h2>;
  else content = (<>
    <Table menuId="courses" onContextMenu={displayMenu} head={['#', 'Nom', 'Professeur', 'Elève', 'Note', 'Coefficient']} menu={<Menu id="grades">
      <Item id="edit" onClick={handleItemClick}>&#x1F589; Editer </Item>
      <Item id="remove" onClick={handleItemClick}>&#x274C; Supprimer</Item>
      </Menu>}>
      {data.grades.map((m, i) => (
        <tr id={`${m.id}`} key={i}>
        <td data-type='id'>{m.id}</td>
        <td data-type='module'>{m.module}</td>
        <td data-type='name'>{m.name}</td>
        </tr>
      ))}
    </Table>
  </>);

  return (
    <UserLayout user={user} flex={true}>
      <h1 className={'title'}>
        Notes <span className={'gradient'}>enregistrées</span>
      </h1>
      {user.userType == 2 && (
        <h3 className={'subtitle'}>
          <Link href="/grades/create">
            <a>Ajouter</a>
          </Link>...
        </h3>
      )}
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
