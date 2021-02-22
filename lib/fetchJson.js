import fetch from 'isomorphic-unfetch';

export default function fetcher (url, settings = {}) {
  return fetch(url, settings).then(r => r.json());
}
