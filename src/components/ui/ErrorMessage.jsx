import styles from "./ErrorMessage.module.css";

export default function ErrorMessage({ message, onRetry, title = "Ошибка загрузки" }) {
  return (
    <div className={styles.error} role="alert">
      <div>
        <strong>{title}</strong>
        <p>{message}</p>
      </div>
      {onRetry && (
        <button type="button" onClick={onRetry}>
          Повторить
        </button>
      )}
    </div>
  );
}
