import { Link } from "react-router-dom";
import styles from "./AuthLayout.module.css";

export default function AuthLayout({
  title,
  subtitle,
  children,
  footer,
  footerLink,
  footerText
}) {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <Link to="/login" className={styles.brand}>
          <span className={styles.mark}>T</span>
          <span>TaskManager</span>
        </Link>
        <div className={styles.heading}>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        {children}
        <p className={styles.footer}>
          {footerText} <Link to={footerLink}>{footer}</Link>
        </p>
      </div>
      <p className={styles.legal}>
        TaskManager workspace
      </p>
    </main>
  );
}