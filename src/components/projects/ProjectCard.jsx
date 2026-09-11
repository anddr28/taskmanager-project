import { Link } from "react-router-dom";
import styles from "./ProjectCard.module.css";

export default function ProjectCard({
  project,
  taskCount,
  doneCount,
  onEdit,
  onDelete
}) {
  const progress = taskCount
    ? Math.round((doneCount / taskCount) * 100)
    : 0;

  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <span
          className={styles.swatch}
          style={{ background: project.color }}
        />
        <div className={styles.actions}>
          <button onClick={onEdit}>Изменить</button>
          <button onClick={onDelete}>Удалить</button>
        </div>
      </div>

      <h2>{project.name}</h2>
      <p>{project.description}</p>

      <div className={styles.meta}>
        <span>{taskCount} {taskCount === 1 ? "задача" : "задач"}</span>
        <strong>{progress}%</strong>
      </div>

      <div className={styles.progress}>
        <span
          style={{
            width: `${progress}%`,
            background: project.color
          }}
        />
      </div>

      <Link
        className={styles.tasksLink}
        to={`/tasks?project=${project.id}`}
      >
        Открыть задачи
      </Link>
    </article>
  );
}