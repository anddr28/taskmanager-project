import Button from "./Button";
import styles from "./EmptyState.module.css";

export default function EmptyState({ title, text, actionText, actionTo }) {
  return (
    <div className={styles.empty}>
      <div className={styles.rule} aria-hidden="true" />
      <h3>{title}</h3>
      <p>{text}</p>
      {actionText && <Button to={actionTo}>{actionText}</Button>}
    </div>
  );
}
