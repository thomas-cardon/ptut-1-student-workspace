import { useRouter } from 'next/router';
import fetcher from 'isomorphic-unfetch';

import Link from '../../components/Link';

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
import Title from '../../components/Title';

import { FormButton as Button } from '../../components/FormFields';
import { HiPlusCircle, HiRefresh } from "react-icons/hi";

import use from '../../lib/use';
import useUser from '../../lib/useUser';

import { useToasts } from 'react-toast-notifications';

import Loader from 'react-loader-spinner';

export default function UserListPage({ module }) {
  /*
   * Variable definitions
   */

  const { addToast } = useToasts();
  const router = useRouter();

  const { user } = useUser({ redirectTo: '/login' });
  const { data: users, setSize, size } = use({ url: '/api/users', infinite: true });

  const displayMenu = e => contextMenu.show({
    id: "userTable",
    event: e,
    props: { id: e.currentTarget.id, email: e.currentTarget.dataset.email }
  });

  function handleItemClick({ event, props, data, triggerEvent }) {
    switch (event.currentTarget.id) {
      case "copyEmailAddress":
        navigator.clipboard.writeText(props.email).then(() => addToast('Adresse mail copiée dans le presse-papiers', { appearance: 'success' })).catch(error => {
          console.error(error);
          addToast("Erreur: vous n'avez pas donné les permissions du presse-papiers.", { appearance: 'error' });
        });
        break;
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

  /*
   * End of variable definitions
   */

  let content = <Loader type="Oval" color="var(--color-accent)" height="5em" width="100%" />;

  if (user?.isLoggedIn && users) {
    content = <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Table head={['Nom', 'Prénom', 'Groupe', 'Date. naissance', 'Type']} menuId="userTable" onContextMenu={displayMenu} fixed={true} menu={<Menu id="userTable">
        <Item id="copyEmailAddress" onClick={handleItemClick}>Copier adresse e-mail</Item>
        <Separator />
        <Item id="edit" onClick={handleItemClick}>📝 Editer </Item>
        <Separator />
        <Item id="remove" onClick={handleItemClick}>&#x274C; Supprimer</Item>
      </Menu>}>
        {[].concat(...users).map((user, index) => <tr id={`${user.userId}`} data-email={user.email} key={user.userId}>
          <td data-type="lastName">{user.lastName}</td>
          <td data-type="firstName">{user.firstName}</td>
          <td data-type="groupName">{user.group?.name || 'N/A'}</td>
          <td data-type="birthDate">{new Date(user.birthDate).toLocaleString().split(" ")[0]}</td>
          <td data-type="type">{user.userType === 2 ? 'Administration' : user.isDelegate ? 'Délégué' : user.isTeacher ? 'Professeur' : 'Étudiant'}</td>
        </tr>)}
      </Table>
      <Button icon={<HiRefresh />} onClick={() => setSize(size + 1)} style={{ marginBottom: '1em', height: 'unset' }}>Charger plus...</Button>
    </div>;
  }

  return (
    <UserLayout user={user} title="Utilisateurs" flex={true} header={<>
      <Title appendGradient="inscrits" button={user?.userType == 2 ?
        <Link href="/users/edit">
          <Button is="action" icon={<HiPlusCircle />}>Ajouter</Button>
        </Link> : <></>}>
        Étudiants
      </Title>
      </>}>
      <Highlight title="Le saviez-vous?">
        {user?.userType === 0 ? "Impossible d'afficher les utilisateurs: vous n'avez pas les permissions requises." : 'Cliquez sur un utilisateur pour éditer des propriétés.'}
      </Highlight>
      {user?.userType > 0 && content}
    </UserLayout>
  );
};
