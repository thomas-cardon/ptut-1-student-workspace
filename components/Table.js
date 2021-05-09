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

const Table = React.forwardRef((props, ref) => {

  if (props.menuId) {
    const { show } = useContextMenu({
      id: props.menuId
    });

    return (<div>
      {props.menu}
      <table ref={ref} className={[styles.table, props.fixed ? styles.fixed : ''].join(' ')}>
        <thead>
          <tr>
            {props.head.map((x, i) => <th key={'head-' + i}>{x}</th>)}
          </tr>
        </thead>
        <tbody>
          {props.children.filter(child => child.type).map((child, i) => {
            return <child.type onContextMenu={props.onContextMenu} id={i} key={i} {...child.props} />;
          })}
        </tbody>
      </table>
    </div>);
  }

  return (<table className={[styles.table, props.fixed ? styles.fixed : ''].join(' ')}>
    <thead>
      <tr>
        {props.head.map((x, i) => <th key={'head-' + i}>{x}</th>)}
      </tr>
    </thead>
    <tbody>
      {props.children}
    </tbody>
    {props.footer && <tfoot><tr><td colspan={props.head.length}>{props.footer}</td></tr></tfoot>}
  </table>);
});

export default Table;
