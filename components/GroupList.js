import useSWR from 'swr';
import fetcher from '../lib/fetchJson';

import styles from './GroupList.module.css';

export default function GroupList({ children }) {
  const { data, error } = useSWR('/api/schedule/groups', fetcher);

  let content;

  if (data) content = data.data.map((x, i) =>
    <label htmlFor={x.id} style={{ display: 'block' }}>
      <input key={i} type="radio" id={x.id} name="group" value={x.id} />
      ({x.id}) {x.name}
    </label>);
  else if (error) content = <pre><code>{error || "Une erreur s'est produite"}</code></pre>;
  else content = <b>Chargement</b>;


  return (
    <div style={{ font: `1rem Andale Mono, monospace`, padding: '0 1em 0 1em' }}>
      <h3 style={{ textAlign: 'center', backgroundColor: 'antiquewhite' }}>Groupes</h3>
      {content}
    </div>
  );
};
