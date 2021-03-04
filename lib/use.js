import { useEffect } from 'react';
import Router from 'next/router';
import useSWR from 'swr';

import fetch from 'isomorphic-unfetch';
const fetcher = url => fetch(url).then(r => r.json());

export default function use({ url, redirectOnError = false } = {}) {
  const { data } = useSWR(url, fetcher);
  console.log('[use] Refreshing', url);

  useEffect(() => {
    if (redirectOnError && data?.error) return Router.push(redirectOnError);
  }, [data, redirectOnError]);

  return { data };
}
