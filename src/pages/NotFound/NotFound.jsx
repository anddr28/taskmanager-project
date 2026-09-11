import { Link } from "react-router-dom";
import styles from "./NotFound.module.css";

export default function NotFound() {
  return (
    <div className={styles.page}>
      <strong>404</strong>
      <h1>Страница не найдена</h1>
      <p>Такого адреса в TaskManager нет.</p>
      <Link to="/">Вернуться к обзору</Link>
    </div>
  );
}