import { useRouter } from 'next/router';

import Link from 'next/link';

import {
  contextMenu,
  Menu,
  Item,
  Separator,
  Submenu
} from "react-contexify";

import UserLayout from '../../components/UserLayout';
import Highlight from "../../components/Highlight";
import Table from '../../components/Table';

import useSWR from 'swr';
import fetcher from '../../lib/fetchJson';
import withSession from "../../lib/session";

import { useToasts } from 'react-toast-notifications';

export default function UserListPage({ user, module }) {
  const { data, error } = useSWR('/api/users/list', fetcher);
  const { addToast } = useToasts();
  const router = useRouter();

  const displayMenu = e => contextMenu.show({
    id: "userTable",
    event: e,
    props: { id: e.currentTarget.id }
  });

  function handleItemClick({ event, props, data, triggerEvent }) {
    switch (event.currentTarget.id) {
      case "edit":
        router.push('/users/edit?id=' + props.id);
        break;
      case "remove":
        if (!confirm('Voulez-vous vraiment supprimer cet utilisateur?'))
          return;

        fetcher(location.protocol + '//' + location.host + '/api/users/' + props.id, { method: 'DELETE' })
        .then(() => addToast(`Suppression réussie de l'utilisateur #${props.id}`, { appearance: 'success' }))
        .catch(err => {
          addToast("Une erreur s'est produite.", { appearance: 'error' });
          console.error(err);
        });
        break;
    }
  }

  let content;

  if (!data) content = <h2 className={'title'}>Chargement</h2>;
  else if (error) {
    content = <h2 className={'title'}>Erreur !</h2>;
    console.error(error);
  }
  else if (!data.users) content = <h2 className={'title'}>Il n'y a aucun utilisateur.</h2>;
  else {
    content = (<>
      <Table menuId="userTable" onContextMenu={displayMenu} head={['#', 'Nom', 'Prénom', 'E-mail', 'Groupe', 'Type']} menu={<Menu id="userTable">
        <Item id="edit" onClick={handleItemClick}>&#x1F589; Editer </Item>
        <Item id="remove" onClick={handleItemClick}>&#x274C; Supprimer</Item>
      </Menu>}>
        {data.users.map((user, i) => (
          <tr id={`${user.userId}`} key={i}>
            <td data-type='id'>{user.userId}</td>
            <td data-type='lastName'>{user.lastName}</td>
            <td data-type='firstName'>{user.firstName}</td>
            <td data-type='email'>{user.email}</td>
            <td data-type='groupName'>{user.group.name}</td>
            <td data-type='type'>{user.userType === 0 ? 'Étudiant' : user.userType === 1 ? 'Professeur' : 'Administration'}</td>
          </tr>
        ))}
      </Table>
    </>);
  }

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
        <Highlight title={'Le saviez-vous?'}>
          Cliquez sur un utilisateur pour éditer des propriétés.
        </Highlight>
        {content}
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
