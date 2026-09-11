import { Link } from "react-router-dom";
import Badge from "../ui/Badge";
import { formatDate } from "../../utils/formatters";
import styles from "./TaskTable.module.css";

export default function TaskTable({
  tasks,
  projectMap,
  onDelete
}) {
  return (
    <div className={styles.wrapper}>
      <table>
        <thead>
          <tr>
            <th>Задача</th>
            <th>Проект</th>
            <th>Статус</th>
            <th>Приоритет</th>
            <th>Автор</th>
            <th>Срок</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td className={styles.taskCell}>
                <Link to={`/tasks/${task.id}`}>{task.title}</Link>
                <span>{task.description}</span>
              </td>
              <td>{projectMap[task.projectId] || "Без проекта"}</td>
              <td><Badge type={task.status} /></td>
              <td><Badge type={task.priority} /></td>
              <td>{task.assignee}</td>
              <td>{formatDate(task.dueDate)}</td>
              <td>
                <div className={styles.actions}>
                  <Link to={`/tasks/${task.id}/edit`}>Изменить</Link>
                  <button onClick={() => onDelete(task)}>Удалить</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}