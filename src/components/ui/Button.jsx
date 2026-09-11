import { Link } from "react-router-dom";
import styles from "./Button.module.css";

export default function Button({
  children,
  variant = "primary",
  size = "medium",
  to,
  type = "button",
  disabled = false,
  onClick,
  ariaLabel
}) {
  const className = `${styles.button} ${styles[variant] || ""} ${styles[size] || ""}`;

  if (to) {
    return (
      <Link className={className} to={to} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  return (
    <button
      className={className}
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
