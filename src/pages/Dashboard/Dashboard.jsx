import { Link } from "react-router-dom";
import { useTasks } from "../../hooks/useTasks";
import { useProjects } from "../../hooks/useProjects";
import Loading from "../../components/ui/Loading";
import ErrorMessage from "../../components/ui/ErrorMessage";
import Button from "../../components/ui/Button";
import { formatDate } from "../../utils/formatters";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const {
    tasks,
    loading,
    error,
    fetchTasks
  } = useTasks();

  const {
    projects,
    loading: projectsLoading,
    error: projectsError,
    fetchProjects
  } = useProjects();

  const done = tasks.filter((task) => task.status === "done").length;
  const active = tasks.filter((task) => task.status === "in-progress").length;
  const high = tasks.filter(
    (task) => task.priority === "high" && task.status !== "done"
  ).length;

  const upcoming = [...tasks]
    .filter((task) => task.status !== "done")
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  const projectMap = Object.fromEntries(
    projects.map((project) => [project.id, project.name])
  );

  return (
    <div className="page">
      <header className={styles.header}>
        <div>
          <div className="eyebrow">Обзор</div>
          <h1>Рабочее пространство</h1>
          <p>Задачи и ближайшие сроки в одном месте.</p>
        </div>
        <Button to="/tasks/new">Новая задача</Button>
      </header>

      {loading || projectsLoading ? (
        <Loading />
      ) : error || projectsError ? (
        <ErrorMessage
          message={error || projectsError}
          onRetry={() => {
            if (error) fetchTasks();
            if (projectsError) fetchProjects();
          }}
        />
      ) : (
        <>
          <section className={styles.stats}>
            <Stat label="Всего задач" value={tasks.length} />
            <Stat label="В работе" value={active} />
            <Stat label="Выполнено" value={done} />
            <Stat label="Высокий приоритет" value={high} />
          </section>

          <section className={styles.contentGrid}>
            <div className={styles.panel}>
              <div className={styles.panelHead}>
                <div>
                  <h2>Ближайшие сроки</h2>
                  <span>Незавершённые задачи</span>
                </div>
                <Link to="/tasks">Все задачи</Link>
              </div>

              <div className={styles.rows}>
                {upcoming.length ? (
                  upcoming.map((task) => (
                    <Link
                      className={styles.row}
                      key={task.id}
                      to={`/tasks/${task.id}`}
                    >
                      <div className={styles.rowMain}>
                        <strong>{task.title}</strong>
                        <span>{projectMap[task.projectId] || "Без проекта"}</span>
                      </div>
                      <time>{formatDate(task.dueDate)}</time>
                    </Link>
                  ))
                ) : (
                  <div className={styles.noRows}>Все задачи завершены.</div>
                )}
              </div>
            </div>

            <div className={styles.panel}>
              <div className={styles.panelHead}>
                <div>
                  <h2>Проекты</h2>
                  <span>Активные рабочие области</span>
                </div>
                <Link to="/projects">Все</Link>
              </div>

              <div className={styles.projectRows}>
                {projects.slice(0, 5).map((project) => (
                  <Link
                    key={project.id}
                    to={`/tasks?project=${project.id}`}
                    className={styles.projectRow}
                  >
                    <span
                      className={styles.projectDot}
                      style={{ background: project.color }}
                    />
                    <strong>{project.name}</strong>
                    <span>
                      {tasks.filter((task) => task.projectId === project.id).length}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className={styles.stat}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}