import { useRouter } from 'next/router';
import Link from '../../components/Link';

import UserLayout from '../../components/UserLayout';
import Table from '../../components/Table';
import Title from '../../components/Title';

import Button from '../../components/FormFields/FormButton';
import { HiPlusCircle } from "react-icons/hi";

import Loader from 'react-loader-spinner';

import {
  contextMenu,
  Menu,
  Item,
  Separator,
  Submenu
} from "react-contexify";

import withSession from "../../lib/session";

import { useSubjects } from '../../lib/hooks';
import { useToasts } from 'react-toast-notifications';

export default function ClassListPage({ user }) {
  const { data : subjects } = useSubjects();
  const { addToast } = useToasts();
  const router = useRouter();

  const displayMenu = e => contextMenu.show({
    id: "courses",
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

  let content = <Loader type="Oval" color="var(--color-accent)" height="5em" width="100%" />;

  if (subjects?.length == 0) content = <h2 className={'title'}>Aucun cours disponible</h2>;
  else if (subjects) content = (<>
    <Table menuId="courses" onContextMenu={displayMenu} head={['#', 'Module', 'Nom']} menu={<Menu id="courses">
      <Item id="edit" onClick={handleItemClick}>&#x1F589; Editer </Item>
      <Item id="remove" onClick={handleItemClick}>&#x274C; Supprimer</Item>
      </Menu>}>
      {subjects.map((m, i) => (
        <tr id={`${m.id}`} key={i}>
        <td data-type='id'>{m.id}</td>
        <td data-type='module'>{m.module}</td>
        <td data-type='name'>{m.name}</td>
        </tr>
      ))}
    </Table>
  </>);

  return (
    <UserLayout user={user} flex={true} header={<>
      <Title appendGradient="enregistrés" button={user.userType == 2 ?
        <Link href="/subjects/create">
          <Button is="action" icon={<HiPlusCircle />}>Ajouter</Button>
        </Link> : <></>}>
        Matières
      </Title>
      </>}>
      {content}
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
    props: { user: req.session.get('user') }
  };
});
