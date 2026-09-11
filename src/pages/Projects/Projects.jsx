import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useProjects } from "../../hooks/useProjects";
import { useTasks } from "../../hooks/useTasks";
import ProjectForm from "../../components/projects/ProjectForm";
import ProjectCard from "../../components/projects/ProjectCard";
import Button from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";
import ErrorMessage from "../../components/ui/ErrorMessage";
import EmptyState from "../../components/ui/EmptyState";
import styles from "./Projects.module.css";

const empty = {
  name: "",
  description: "",
  color: "#2563a6"
};

export default function Projects() {
  const { user } = useAuth();
  const {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject
  } = useProjects();
  const { tasks } = useTasks();

  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const save = async (values) => {
    setSubmitting(true);
    setSaveError("");

    try {
      if (editing) {
        await updateProject(editing.id, {
          ...editing,
          ...values
        });
      } else {
        await createProject({
          ...values,
          id: crypto.randomUUID(),
          ownerId: user.id,
          createdAt: new Date().toISOString()
        });
      }

      setEditing(null);
      setShowForm(false);
    } catch (saveError) {
      setSaveError(saveError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const remove = (project) => {
    const used = tasks.some((task) => task.projectId === project.id);

    setDeleteError("");

    if (used) {
      setDeleteError(
        "В проекте есть задачи. Сначала перенесите или удалите их."
      );
      return;
    }

    setPendingDelete(project);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;

    try {
      await deleteProject(pendingDelete.id);
      setPendingDelete(null);
    } catch (error) {
      setDeleteError(error.message);
    }
  };

  return (
    <div className="page">
      <header className={styles.header}>
        <div>
          <div className="eyebrow">Workspace / Projects</div>
          <h1>Проекты</h1>
          <p>Организуйте задачи по рабочим контекстам.</p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setSaveError("");
            setShowForm(true);
          }}
        >
          Новый проект
        </Button>
      </header>

      {showForm && (
        <section className={styles.formPanel}>
          <div className={styles.formHead}>
            <div>
              <h2>{editing ? "Изменить проект" : "Новый проект"}</h2>
              <p>Основные свойства рабочей области.</p>
            </div>
            <button onClick={() => setShowForm(false)}>×</button>
          </div>

          {saveError && (
            <ErrorMessage
              message={saveError}
              title="Не удалось сохранить проект"
            />
          )}

          <ProjectForm
            initialValues={editing || empty}
            onSubmit={save}
            onCancel={() => setShowForm(false)}
            submitting={submitting}
          />
        </section>
      )}

      {pendingDelete && (
        <div role="alert">
          <p>Удалить «{pendingDelete.name}»?</p>
          <Button size="small" variant="danger" onClick={confirmDelete}>Удалить</Button>{" "}
          <Button size="small" variant="secondary" onClick={() => setPendingDelete(null)}>Отмена</Button>
        </div>
      )}

      {deleteError && (
        <ErrorMessage message={deleteError} title="Не удалось удалить проект" />
      )}

      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorMessage
          message={error}
          onRetry={fetchProjects}
        />
      ) : projects.length ? (
        <div className={styles.grid}>
          {projects.map((project) => {
            const projectTasks = tasks.filter(
              (task) => task.projectId === project.id
            );

            return (
              <ProjectCard
                key={project.id}
                project={project}
                taskCount={projectTasks.length}
                doneCount={
                  projectTasks.filter((task) => task.status === "done").length
                }
                onEdit={() => {
                  setEditing(project);
                  setSaveError("");
                  setShowForm(true);
                }}
                onDelete={() => remove(project)}
              />
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="Проектов пока нет"
          text="Создайте первый проект, чтобы связать с ним задачи."
          actionText="Создать проект"
          actionTo="/projects"
        />
      )}
    </div>
  );
}
