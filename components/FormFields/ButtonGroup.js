import styles from "./ButtonGroup.module.css";

export default function ButtonGroup({ disableStyle = false, children, ...rest }) {
  return (
    <div className={styles.btnGroup}>
      {children}
    </div>
  );
}
