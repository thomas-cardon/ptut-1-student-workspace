import { useEffect } from 'react';
import Router from 'next/router';
import useSWR from 'swr';

export function useUser({ redirectTo = false, redirectNotAuthorized = false, redirectOnError = false } = {}) {
  const { data: user } = useSWR('/api/me/user');

  useEffect(() => {
    if (redirectNotAuthorized && user?.error == 'NOT_AUTHORIZED') return Router.push(redirectNotAuthorized);
    else if (redirectOnError && user?.error) return Router.push(redirectOnError);
    else if (redirectTo && user?.id) return Router.push(redirectTo);

  }, [user, redirectOnError, redirectNotAuthorized, redirectTo])

  return { user };
}

export function getAvatar(user) {
  return user?.avatar || 'https://avatar.tobi.sh/';
}
