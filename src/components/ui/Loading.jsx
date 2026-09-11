import styles from "./Loading.module.css";

export default function Loading({ text = "Загрузка…" }) {
  return (
    <div className={styles.loading} role="status" aria-live="polite">
      <div className={styles.skeleton} aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
      <span className={styles.label}>{text}</span>
    </div>
  );
}
