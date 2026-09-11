import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTasks } from "../../hooks/useTasks";
import { useProjects } from "../../hooks/useProjects";
import { useAuth } from "../../hooks/useAuth";
import { commentSchema } from "../../validation/commentSchema";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";
import ErrorMessage from "../../components/ui/ErrorMessage";
import { formatDate, formatDateTime, formatFileSize } from "../../utils/formatters";
import styles from "./TaskDetails.module.css";

export default function TaskDetails() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    tasks,
    updateTask,
    deleteTask,
    loading,
    error
  } = useTasks();
  const {
    projects,
    loading: projectsLoading
  } = useProjects();

  const [saving, setSaving] = useState(false);
  const [fileError, setFileError] = useState("");
  const [actionError, setActionError] = useState("");
  const [pendingDelete, setPendingDelete] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: { comment: "" }
  });

  const task = tasks.find((item) => item.id === taskId);
  const project = projects.find((item) => item.id === task?.projectId);

  if (loading || projectsLoading) {
    return <div className="page"><Loading /></div>;
  }

  if (error) {
    return <div className="page"><ErrorMessage message={error} /></div>;
  }

  if (!task) {
    return <div className="page"><ErrorMessage message="Задача не найдена." /></div>;
  }

  const remove = () => {
    setActionError("");
    setPendingDelete(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteTask(task.id);
      navigate("/tasks");
    } catch (removeError) {
      setActionError(removeError.message);
      setPendingDelete(false);
    }
  };

  const addComment = async (values) => {
    setSaving(true);
    setActionError("");

    try {
      await updateTask(task.id, {
        ...task,
        comments: [
          ...(task.comments || []),
          {
            id: crypto.randomUUID(),
            author: user?.name || task.assignee,
            text: values.comment.trim(),
            createdAt: new Date().toISOString()
          }
        ],
        updatedAt: new Date().toISOString()
      });

      reset({ comment: "" });
    } catch (commentError) {
      setActionError(commentError.message);
    } finally {
      setSaving(false);
    }
  };

  const addFile = async (event) => {
    const selected = event.target.files?.[0];

    if (!selected) return;

    setFileError("");

    try {
      await updateTask(task.id, {
        ...task,
        attachments: [
          ...(task.attachments || []),
          {
            id: crypto.randomUUID(),
            name: selected.name,
            size: selected.size,
            type: selected.type
          }
        ],
        updatedAt: new Date().toISOString()
      });
    } catch (fileUploadError) {
      setFileError(fileUploadError.message);
    } finally {
      event.target.value = "";
    }
  };

  return (
    <div className="page">
      <div className={styles.top}>
        <Link to="/tasks">Задачи</Link>
        <div>
          <Button
            to={`/tasks/${task.id}/edit`}
            variant="secondary"
            size="small"
          >
            Изменить
          </Button>
          <Button
            variant="danger"
            size="small"
            onClick={remove}
          >
            Удалить
          </Button>
        </div>
      </div>

      {pendingDelete && (
        <div role="alert">
          <p>Удалить «{task.title}»?</p>
          <Button size="small" variant="danger" onClick={confirmDelete}>Удалить</Button>{" "}
          <Button size="small" variant="secondary" onClick={() => setPendingDelete(false)}>Отмена</Button>
        </div>
      )}

      {actionError && (
        <ErrorMessage message={actionError} title="Не удалось выполнить действие" />
      )}

      <section className={styles.hero}>
        <div className={styles.badges}>
          <Badge type={task.status} />
          <Badge type={task.priority} />
        </div>
        <h1>{task.title}</h1>
        <p>{task.description}</p>
      </section>

      <div className={styles.grid}>
        <section className={styles.panel}>
          <h2>Детали</h2>
          <dl>
            <Detail label="Проект" value={project?.name || "Без проекта"} />
            <Detail label="Автор" value={task.assignee} />
            <Detail label="Срок" value={formatDate(task.dueDate)} />
            <Detail label="Создана" value={formatDateTime(task.createdAt)} />
            <Detail label="Обновлена" value={formatDateTime(task.updatedAt)} />
          </dl>
        </section>

        <section className={styles.panel}>
          <h2>
            Комментарии <span>{task.comments?.length || 0}</span>
          </h2>

          {task.comments?.length ? (
            <div className={styles.comments}>
              {task.comments.map((item) => (
                <div className={styles.comment} key={item.id}>
                  <span className={styles.avatar}>
                    {item.author.slice(0, 1)}
                  </span>
                  <div>
                    <div className={styles.commentMeta}>
                      <strong>{item.author}</strong>
                      <time>{formatDateTime(item.createdAt)}</time>
                    </div>
                    <p>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.muted}>Комментариев пока нет.</p>
          )}

          <form className={styles.commentForm} onSubmit={handleSubmit(addComment)} noValidate>
            <textarea
              rows="3"
              maxLength="500"
              placeholder="Добавить комментарий…"
              {...register("comment")}
            />
            {errors.comment && (
              <span className={styles.fileError}>{errors.comment.message}</span>
            )}
            <Button
              type="submit"
              size="small"
              disabled={saving}
            >
              {saving ? "Добавление…" : "Добавить"}
            </Button>
          </form>
        </section>

        <section className={styles.panel}>
          <h2>Файлы</h2>

          <label className={styles.fileButton}>
            Прикрепить файл
            <input type="file" onChange={addFile} />
          </label>

          {fileError && <p className={styles.fileError}>{fileError}</p>}

          <div className={styles.files}>
            {(task.attachments || []).map((file) => (
              <div className={styles.file} key={file.id}>
                <span>□</span>
                <strong>{file.name}</strong>
                <small>{formatFileSize(file.size)}</small>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
