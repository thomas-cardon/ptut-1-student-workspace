import styles from "./ButtonGroup.module.css";

export default function ButtonGroup({ disableStyle = false, children, ...rest }) {
  return (
    <div class={styles.btnGroup}>
      {children}
    </div>
  );
}
