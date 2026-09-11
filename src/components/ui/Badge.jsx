import styles from "./Badge.module.css";

const labels = {
  todo: "To Do",
  "in-progress": "In Progress",
  done: "Done",
  low: "Low",
  medium: "Medium",
  high: "High"
};

export default function Badge({ type }) {
  return (
    <span className={`${styles.badge} ${styles[type] || ""}`}>
      <i aria-hidden="true" />
      <span>{labels[type] || type}</span>
    </span>
  );
}
