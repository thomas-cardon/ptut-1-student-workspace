import { useEffect } from 'react';
import Router from 'next/router';
import useSWR, { useSWRInfinite } from 'swr';

import { fetcher } from './hooks';

export default function use({ url, redirectOnError = false, infinite } = {}) {
  const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.length) return null;
    return `${url}${url.includes('?') ? '&' : '?'}page=${pageIndex}&limit=10`;
  }

  const { data, size, setSize } = infinite ? useSWRInfinite(getKey, fetcher) : useSWR(url, fetcher);

  useEffect(() => {
    if (redirectOnError && data?.error) return Router.push(redirectOnError);
  }, [data, redirectOnError]);

  return { data, setSize, size };
}
