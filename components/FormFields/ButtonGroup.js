import styles from "./ButtonGroup.module.css";

export default function ButtonGroup({ className, style = {}, children, ...rest }) {
  return (
    <div className={[styles.btnGroup, className].join(' ')} style={style}>
      {children}
    </div>
  );
}
