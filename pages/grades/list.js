import React, { useState } from 'react';

import Link from '../../components/Link';

import UserLayout from '../../components/UserLayout';
import Highlight from '../../components/Highlight';
import Table from '../../components/Table';
import Title from '../../components/Title';

import Button from '../../components/FormFields/FormButton';

import { HiPlusCircle } from "react-icons/hi";

import {
  contextMenu,
  Menu,
  Item,
  Separator,
  Submenu
} from "react-contexify";

import { useGrades } from '../../lib/hooks';
import withSession from "../../lib/session";
import { useDarkMode } from 'next-dark-mode';

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import fuzzy from '../../lib/fuzzySearch';

export default function GradesListPage({ user, id }) {
  /*
   * Variable definitions
   */
   const [query, setQuery] = useState("");

   const { data } = useGrades(id);
   const { darkModeActive } = useDarkMode();

  let content, users = [];

  if (!data) content = <h2 className={'title'}>Chargement</h2>;
  else if (data === {}) content = <h2 className={'title'}>Aucune note disponible</h2>;
  else {
    users = fuzzy(Object.values(data), query);
    content = (<>
      {users.map((user, i) => (<div key={i}>
        <h3 style={{ margin: '1em 0 0 0' }}>
          <span>{user[Object.keys(user)[0]][0].userFirstName} {user[Object.keys(user)[0]][0].userLastName}</span>
          {user[0]?.userGroupName && (<>
            <span style={{ margin: '0 0.5em' }}>→</span>
            <span>
              Groupe:&nbsp;
              <i>{user[0]?.userGroupName}</i>
            </span>
          </>)}
        </h3>
        <hr style={{ width: '50%', margin: '1em 2em 2em 0' }} />
        <Table head={['Matière', 'Nom', 'Professeur', 'Note', 'Coef.', 'Présent', 'Appréciations', 'Date']} fixed={true}>
          {Object.keys(user).map((m, x) => (<React.Fragment key={i + '-m-' + x}>
            <tr style={{ backgroundColor: darkModeActive ? '#272c34' : '#ddd' }}>
              <td data-type='subject'>
                <p style={{ margin: '0' }}>{user[m][0].subjectModule}</p>
                <p style={{ fontSize: 'x-small', margin: '0' }}>{user[m][0].subjectName}</p>
              </td>
              <td />
              <td />
              <td />
              <td />
              <td />
              <td />
              <td />
            </tr>
            {user[m].map((note, y) => (<tr key={i + '-m-' + x + '-n-' + y}>
              <td />
              <td data-type='name'>{note.name}</td>
              <td data-type='teacher'>{note.teacherFirstName} {note.teacherLastName}</td>
              <td data-type='value'>{(note.value || 0) + '/' + note.max}</td>
              <td data-type='coefficient'>{note.coefficient}</td>
              <td data-type='wasHere'>{note.wasAbsent === 1 ? '❌' : '✔️'}</td>
              <td data-type='notes'>{note.notes || 'N/A'}</td>
              <td data-type='date'>{format(Date.parse(note.date), 'd MMMM yyyy', { locale: fr }) || 'N/A'}</td>
            </tr>))}
          </React.Fragment>))}
        </Table>
      </div>))}
    </>);
  };

  return (
    <UserLayout user={user} flex={true} header={<>
      <Title appendGradient="enregistrées">
        Notes
      </Title>
      </>}>
      {user.userType == 2 && (
        <h3 className={'subtitle'}>
          <Link href="/grades/create">

            <Button is="action" icon={<HiPlusCircle />}>Ajouter</Button>
          </Link>
        </h3>
      )}
      <div className={'grid'} style={{ width: '92%' }}>
        <Highlight title={'A savoir'}>
          {!id ? 'Vous ne verrez que les étudiants dans la liste des notes.' : "Vous ne voyez qu'un seul étudiant actuellement. Pour tous les voir, cliquez sur le lien dans la barre latérale."}
        </Highlight>
        {(users.length > 0 && query !== "") && (
          <p style={{ textAlign: 'center'}}><i style={{ marginBottom: '1em', marginTop: '-0.5em' }}>{users.length} résultats pour {query}...</i></p>
        )}
        {(users.length === 0 && query !== "") && (
          <p style={{ textAlign: 'center'}}><i style={{ marginBottom: '1em', marginTop: '-0.5em' }}>Aucun résultat</i></p>
        )}
        {(users.length === 0 && query === "") && (
          <p style={{ textAlign: 'center'}}><i style={{ marginBottom: '1em', marginTop: '-0.5em' }}>Il n'y a aucune note ou utilisateur enregistré dans la base de données...</i></p>
        )}
        {content}
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
