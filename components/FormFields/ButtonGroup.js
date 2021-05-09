import styles from "./ButtonGroup.module.css";

export default function ButtonGroup({ style = {}, children, ...rest }) {
  return (
    <div className={styles.btnGroup} style={style}>
      {children}
    </div>
  );
}
