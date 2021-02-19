import fetch from 'isomorphic-unfetch';

export default function fetcher (url) {
  return fetch(url).then(r => r.json());
}
