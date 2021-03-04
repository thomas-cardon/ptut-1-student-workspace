import React from 'react';

import { useRouter } from 'next/router';
import Link from 'next/link';

import UserLayout from '../../components/UserLayout';
import Highlight from '../../components/Highlight';
import Table from '../../components/Table';
import Title from '../../components/Title';

import {
  contextMenu,
  Menu,
  Item,
  Separator,
  Submenu
} from "react-contexify";

import use from '../../lib/use';
import withSession from "../../lib/session";

import { useToasts } from 'react-toast-notifications';
import { useDarkMode } from 'next-dark-mode';

export default function ClassListPage({ user, id }) {
  const { data } = use({ url: '/api/grades', redirectOnError: '/error' });

  const { darkModeActive } = useDarkMode();
  const { addToast } = useToasts();
  const router = useRouter();

  let content;

  if (!data) content = <h2 className={'title'}>Chargement</h2>;
  else if (data.data === {}) content = <h2 className={'title'}>Aucune note disponible</h2>;
  else content = (<>
    {Object.keys(data.data).map((key, i) => (<div key={key}>
      <h3 style={{ margin: '1em 0 0 0' }}>
        <span>{data.data[key][Object.keys(data.data[key])[0]][0].userFirstName} {data.data[key][Object.keys(data.data[key])[0]][0].userLastName}</span>
        {data.data[key][0]?.userGroupName && (<>
          <span style={{ margin: '0 0.5em' }}>→</span>
          <span>
            Groupe:&nbsp;
            <i>{data.data[key][0]?.userGroupName}</i>
          </span>
        </>)}
      </h3>
      <hr style={{ width: '50%', margin: '1em 2em 2em 0' }} />
      <Table head={['Matière', 'Nom', 'Professeur', 'Note', 'Coef.', 'Absent', 'Appréciations']}>
        {Object.keys(data.data[key]).map((m, i) => (<React.Fragment key={key + '-' + m}>
          <tr style={{ backgroundColor: darkModeActive ? '#272c34' : '#ddd' }}>
            <td data-type='subject'>
              <p style={{ margin: '0' }}>{data.data[key][m][0].subjectModule}</p>
              <p style={{ fontSize: 'xx-small', margin: '0' }}>{data.data[key][m][0].subjectName}</p>
            </td>
            <td />
            <td />
            <td />
            <td />
            <td />
            <td />
          </tr>
          {data.data[key][m].map((note, i) => (<tr key={key + '-' + m + '-' + i}>
            <td />
            <td data-type='name'>{note.name}</td>
            <td data-type='teacher'>{note.teacherFirstName} {note.teacherLastName}</td>
            <td data-type='value'>{(note.value || 0) + '/' + note.max}</td>
            <td data-type='coefficient'>{note.coefficient}</td>
            <td data-type='absent'>{note.wasAbsent === 1 ? '❌' : '✔️'}</td>
            <td data-type='notes'>{note.notes || 'N/A'}</td>
          </tr>))}
        </React.Fragment>))}
      </Table>
    </div>))}
  </>);

  return (
    <UserLayout user={user} flex={true}>
      <Title appendGradient="enregistrées">
        Notes
      </Title>
      {user.userType == 2 && (
        <h3 className={'subtitle'}>
          <Link href="/grades/create">
            <a>Ajouter</a>
          </Link>...
        </h3>
      )}
      <div className={'grid'}>
        {!id && (
          <Highlight title={'A savoir'}>
            Vous ne verrez que les étudiants dans la liste des notes.
          </Highlight>
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
