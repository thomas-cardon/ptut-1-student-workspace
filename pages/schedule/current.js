import React, { useState, useRef } from 'react';
import Router from 'next/router';

import UserLayout from '../../components/UserLayout';
import Highlight from '../../components/Highlight';
import Title from '../../components/Title';
import Table from '../../components/Table';

import { useToasts } from 'react-toast-notifications';

import { useCurrentClass } from '../../lib/hooks';
import withSession from "../../lib/session";

export default function CurrentSchedulePage({ user }) {
  const { data : current } = useCurrentClass();
  /*
   * Variable definitions
   */

   return (
      <UserLayout user={user} flex={true} header={<>
          <Title appendGradient="actuel">
            Votre cours
          </Title>
        </>}>
        {!current && <p>Chargement</p>}
        {current?.error === 'NOT_FOUND' && (
          <Highlight icon="❌" title="Erreur">
            Vous n'êtes pas en cours actuellement.
            <br />
            Si vous pensez que c'est une erreur, contactez le support.
          </Highlight>
        )}
        {current?.students && (
          <Table head={['Nom', 'Prénom', 'Groupe', 'Date. naissance', 'Présent', "Raison d'absence"]} footer={<tr><td><i>35 élèves | 1 groupe</i></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>} fixed={true}>
            {current.students.map((user, index) => <tr id={`${user.userId}`} key={user.userId}>
              <td data-type="id">{user.userId}</td>
              <td data-type="lastName">{user.lastName}</td>
              <td data-type="firstName">{user.firstName}</td>
              <td data-type="email">{user.email}</td>
              <td data-type="groupName">{user.group.name}</td>
              <td data-type="type">{user.userType === 0 ? 'Étudiant' : user.userType === 1 ? 'Professeur' : 'Administration'}</td>
            </tr>)}
          </Table>
        )}
      </UserLayout>);
};

export const getServerSideProps = withSession(async function ({ req, res }) {
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
