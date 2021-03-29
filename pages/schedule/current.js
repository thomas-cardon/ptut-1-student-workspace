import React, { useState, useRef } from 'react';
import Router from 'next/router';

import UserLayout from '../../components/UserLayout';
import Title from '../../components/Title';

import Form from "../../components/Form";
import * as Fields from "../../components/FormFields";

import { useToasts } from 'react-toast-notifications';

import use from '../../lib/use';
import { useGroups, useUsers, useSubjects } from '../../lib/hooks';
import withSession from "../../lib/session";

import { formatDuration, differenceInMinutes, isSameDay, getDay, addMinutes } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function EditSchedulePage({ user }) {
  /*
   * Variable definitions
   */

  return (
    <UserLayout user={user} flex={true} header={<>
        <Title appendGradient="actuel">
          Votre cours
        </Title>
      </>}>
    </UserLayout>
  );
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
