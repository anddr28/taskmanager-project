import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTasks } from "../../hooks/useTasks";
import { useProjects } from "../../hooks/useProjects";
import { useAuth } from "../../hooks/useAuth";
import TaskForm from "../../components/tasks/TaskForm";
import Loading from "../../components/ui/Loading";
import ErrorMessage from "../../components/ui/ErrorMessage";
import styles from "./TaskFormPage.module.css";

const empty = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  projectId: "",
  dueDate: ""
};

export default function TaskCreate() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createTask } = useTasks();
  const {
    projects,
    loading,
    error,
    fetchProjects
  } = useProjects();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const submit = async (values) => {
    setSubmitting(true);
    setSubmitError("");

    try {
      const now = new Date().toISOString();

      await createTask({
        ...values,
        authorId: user.id,
        assignee: user.name,
        createdAt: now,
        updatedAt: now,
        comments: [],
        attachments: []
      });

      navigate("/tasks");
    } catch (submitError) {
      setSubmitError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <div className={styles.heading}>
        <span onClick={() => navigate(-1)}>← Назад</span>
        <div className="eyebrow">New task</div>
        <h1>Новая задача</h1>
        <p>Добавьте задачу и привяжите её к проекту.</p>
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchProjects} />
      ) : projects.length ? (
        <>
          {submitError && (
            <ErrorMessage message={submitError} title="Не удалось сохранить задачу" />
          )}
          <TaskForm
            initialValues={empty}
            projects={projects}
            onSubmit={submit}
            submitting={submitting}
          />
        </>
      ) : (
        <ErrorMessage message="Сначала создайте хотя бы один проект." />
      )}
    </div>
  );
}
