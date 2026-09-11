import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTasks } from "../../hooks/useTasks";
import { useProjects } from "../../hooks/useProjects";
import TaskForm from "../../components/tasks/TaskForm";
import Loading from "../../components/ui/Loading";
import ErrorMessage from "../../components/ui/ErrorMessage";
import styles from "./TaskFormPage.module.css";

export default function TaskEdit() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const {
    tasks,
    updateTask,
    loading,
    error
  } = useTasks();
  const {
    projects,
    loading: projectsLoading
  } = useProjects();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const task = tasks.find((item) => item.id === taskId);

  if (loading || projectsLoading) {
    return <div className="page"><Loading /></div>;
  }

  if (error) {
    return <div className="page"><ErrorMessage message={error} /></div>;
  }

  if (!task) {
    return <div className="page"><ErrorMessage message="Задача не найдена." /></div>;
  }

  const submit = async (values) => {
    setSubmitting(true);
    setSubmitError("");

    try {
      await updateTask(task.id, {
        ...task,
        ...values,
        updatedAt: new Date().toISOString()
      });

      navigate(`/tasks/${task.id}`);
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
        <div className="eyebrow">Edit task</div>
        <h1>Изменить задачу</h1>
        <p>Обновите нужные поля и сохраните изменения.</p>
      </div>

      {submitError && (
        <ErrorMessage message={submitError} title="Не удалось сохранить задачу" />
      )}

      <TaskForm
        projects={projects}
        submitting={submitting}
        onSubmit={submit}
        initialValues={{
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          projectId: task.projectId,
          dueDate: task.dueDate
        }}
      />
    </div>
  );
}
