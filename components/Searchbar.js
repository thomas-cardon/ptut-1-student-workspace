import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { getSuggestions } from '../lib/search';

import styles from './Searchbar.module.css';

export default function Searchbar() {
  const router = useRouter();

  const [filtered, setFilteredSuggestions] = useState([]);
  const [input, setUserInput] = useState('');
  const inputEl = useRef(null);

  useEffect(() => {
    setFilteredSuggestions(getSuggestions().filter(suggestion =>
      suggestion.toLowerCase().indexOf(input.toLowerCase()) > -1));
  }, [input]);

  useEffect(() => {
    const handle = (e) => {
       if (e.keyCode !== 70 || !e.ctrlKey) return;
       e.preventDefault();
       inputEl.current.focus();
    };

    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, []);

  const onSelect = action => {
    console.log('Action >>', action);

    switch(action) {
      case 'Emploi du temps':
        router.push('/schedule');
        break;
      case 'Matières':
        router.push('/subjects');
        break;
      case 'Utilisateurs':
        router.push('/users');
        break;
      case 'Etudiants':
        router.push('/users');
        break;
      case 'Mentions légales':
        router.push('/legal');
        break;
      case 'Informations':
        router.push('/posts');
        break;
      case 'Newsfeed':
        router.push('/news');
        break;
      case 'Paramètres':
        router.push('/settings');
        break;
      case 'Tableau de bord':
        router.push('/');
        break;
      case 'Déconnexion':
        router.push('/logout');
        break;
      default:
        alert('Action non gérée');
        break;
    }
  }

  const onClick = (e) => {
    setFilteredSuggestions([]);
    setUserInput('');

    onSelect(e.currentTarget.innerText);
  };

  return (<>
    <div className={styles['input-container']} style={input !== '' && filtered.length > 0 ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } : {}}>
      <div className={styles.icon}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#sm-solid-search_svg__clip0)" fill-rule="evenodd" clip-rule="evenodd"><path d="M7.212 1.803a5.409 5.409 0 100 10.818 5.409 5.409 0 000-10.818zM0 7.212a7.212 7.212 0 1114.424 0A7.212 7.212 0 010 7.212z"></path><path d="M11.03 11.03a.901.901 0 011.275 0l3.43 3.432a.902.902 0 01-1.274 1.275l-3.431-3.431a.901.901 0 010-1.275z"></path></g><defs><clipPath id="sm-solid-search_svg__clip0"><path d="M0 0h16v16H0z"></path></clipPath></defs></svg>
      </div>
      <input ref={inputEl} id="search" name="search" type="text" placeholder="Recherchez des actions rapides, utilisateurs, des groupes" autoComplete="off" value={input} onChange={e => setUserInput(e.target.value)} />
    </div>
    {input !== '' && filtered.length === 0 && (
      <div className={styles['no-suggestions']}>
        <em>Aucune suggestion disponible.</em>
      </div>
    )}
    {input !== '' && filtered.length > 0 && (
      <ul className={styles.suggestions}>
        {filtered.map((suggestion, index) => {
          return (
            <li className={styles['suggestion-active']} key={suggestion} onClick={onClick}>
              {suggestion}
            </li>
          );
        })}
      </ul>
    )}
  </>);
};
