import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema } from "../../validation/taskSchema";
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from "../../utils/constants";
import Button from "../ui/Button";
import styles from "./TaskForm.module.css";

export default function TaskForm({
  initialValues,
  projects,
  onSubmit,
  submitting
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: initialValues
  });

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  const fieldError = (name) =>
    errors[name] ? (
      <span className={styles.error}>{errors[name].message}</span>
    ) : null;

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={styles.grid}>
        <label className={styles.full}>
          Название
          <input {...register("title")} placeholder="Название задачи" />
          {fieldError("title")}
        </label>

        <label className={styles.full}>
          Описание
          <textarea
            rows="5"
            {...register("description")}
            placeholder="Коротко опишите ожидаемый результат"
          />
          {fieldError("description")}
        </label>

        <label>
          Статус
          <select {...register("status")}>
            {STATUS_OPTIONS.map((x) => (
              <option key={x.value} value={x.value}>{x.label}</option>
            ))}
          </select>
          {fieldError("status")}
        </label>

        <label>
          Приоритет
          <select {...register("priority")}>
            {PRIORITY_OPTIONS.map((x) => (
              <option key={x.value} value={x.value}>{x.label}</option>
            ))}
          </select>
          {fieldError("priority")}
        </label>

        <label>
          Проект
          <select {...register("projectId")}>
            <option value="">Выберите проект</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
          {fieldError("projectId")}
        </label>

        <label>
          Срок
          <input type="date" {...register("dueDate")} />
          {fieldError("dueDate")}
        </label>
      </div>

      <div className={styles.actions}>
        <Button to="/tasks" variant="secondary">Отмена</Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Сохранение…" : "Сохранить"}
        </Button>
      </div>
    </form>
  );
}
