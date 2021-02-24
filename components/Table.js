import React from 'react';
import styles from './Table.module.css';

import {
  Menu,
  Item,
  Separator,
  Submenu,
  useContextMenu
} from "react-contexify";

import "react-contexify/dist/ReactContexify.css";

import { useDarkMode } from 'next-dark-mode';

const Table = React.forwardRef((props, ref) => {
  const { darkModeActive } = useDarkMode();

  if (props.menuId) {
    const { show } = useContextMenu({
      id: props.menuId
    });

    return (<div>
      {props.menu}
      <table ref={ref} className={[styles.table, darkModeActive ? styles['table-dark'] : ''].join(' ')}>
        <thead>
          <tr>
            {props.head.map((x, i) => <th key={'head-' + i}>{x}</th>)}
          </tr>
        </thead>
        <tbody>
          {props.children.map((child, i) => {
            return <child.type onContextMenu={props.onContextMenu} id={i} key={i} {...child.props} />;
          })}
        </tbody>
      </table>
    </div>);
  }

  return (<>
    <table ref={ref} className={[styles.table, darkModeActive ? styles['table-dark'] : ''].join(' ')}>
      <thead>
        <tr>
          {props.head.map((x, i) => <th key={'head-' + i}>{x}</th>)}
        </tr>
      </thead>
      <tbody onClick={show}>
        {props.children}
      </tbody>
    </table>
  </>);
});

export default Table;
