import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTasks } from "../../hooks/useTasks";
import { useProjects } from "../../hooks/useProjects";
import TaskFilters from "../../components/tasks/TaskFilters";
import TaskTable from "../../components/tasks/TaskTable";
import Loading from "../../components/ui/Loading";
import ErrorMessage from "../../components/ui/ErrorMessage";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../components/ui/Button";
import styles from "./Tasks.module.css";

const initialFilters = {
  search: "",
  status: "",
  priority: "",
  authorId: "",
  projectId: "",
  sort: "created-desc"
};

export default function Tasks() {
  const [params] = useSearchParams();
  const {
    tasks,
    loading,
    error,
    fetchTasks,
    deleteTask
  } = useTasks();
  const {
    projects,
    loading: projectsLoading
  } = useProjects();

  const [filters, setFilters] = useState({
    ...initialFilters,
    projectId: params.get("project") || ""
  });
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const authors = Array.from(
    new Map(
      tasks.map((task) => [
        task.authorId,
        {
          id: task.authorId,
          name: task.assignee
        }
      ])
    ).values()
  );

  const projectMap = Object.fromEntries(
    projects.map((project) => [project.id, project.name])
  );

  const visible = useMemo(() => {
    const result = tasks.filter((task) => {
      const query = filters.search.trim().toLowerCase();

      return (
        (!query ||
          `${task.title} ${task.description} ${task.assignee}`
            .toLowerCase()
            .includes(query)) &&
        (!filters.status || task.status === filters.status) &&
        (!filters.priority || task.priority === filters.priority) &&
        (!filters.authorId || task.authorId === filters.authorId) &&
        (!filters.projectId || task.projectId === filters.projectId)
      );
    });

    return result.sort((a, b) => {
      if (filters.sort === "created-asc") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }

      if (filters.sort === "title-asc") {
        return a.title.localeCompare(b.title, "ru");
      }

      if (filters.sort === "priority-desc") {
        const weight = { high: 3, medium: 2, low: 1 };
        return weight[b.priority] - weight[a.priority];
      }

      if (filters.sort === "due-asc") {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }

      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [tasks, filters]);

  const remove = (task) => {
    setDeleteError("");
    setPendingDelete(task);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;

    try {
      await deleteTask(pendingDelete.id);
      setPendingDelete(null);
    } catch (error) {
      setDeleteError(error.message);
    }
  };

  return (
    <div className="page">
      <header className={styles.header}>
        <div>
          <div className="eyebrow">Workspace / Tasks</div>
          <h1>Задачи</h1>
          <p>Плотный список работы с быстрыми фильтрами и сортировкой.</p>
        </div>
        <Button to="/tasks/new">Новая задача</Button>
      </header>

      {pendingDelete && (
        <div role="alert">
          <p>Удалить «{pendingDelete.title}»?</p>
          <Button size="small" variant="danger" onClick={confirmDelete}>Удалить</Button>{" "}
          <Button size="small" variant="secondary" onClick={() => setPendingDelete(null)}>Отмена</Button>
        </div>
      )}

      {deleteError && (
        <ErrorMessage message={deleteError} title="Не удалось удалить задачу" />
      )}

      <TaskFilters
        filters={filters}
        onChange={(change) =>
          setFilters((current) => ({ ...current, ...change }))
        }
        projects={projects}
        authors={authors}
      />

      {loading || projectsLoading ? (
        <Loading />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchTasks} />
      ) : visible.length ? (
        <TaskTable
          tasks={visible}
          projectMap={projectMap}
          onDelete={remove}
        />
      ) : (
        <EmptyState
          title={tasks.length ? "Ничего не найдено" : "Задач пока нет"}
          text="Измените параметры фильтрации или создайте новую задачу."
          actionText={!tasks.length ? "Создать задачу" : undefined}
          actionTo="/tasks/new"
        />
      )}

      <div className={styles.counter}>
        {visible.length} из {tasks.length}
      </div>
    </div>
  );
}
