import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema } from "../../validation/projectSchema";
import Button from "../ui/Button";
import styles from "./ProjectForm.module.css";

export default function ProjectForm({
  initialValues,
  onSubmit,
  onCancel,
  submitting
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: initialValues
  });

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  const error = (name) =>
    errors[name] ? (
      <span className={styles.error}>{errors[name].message}</span>
    ) : null;

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <label>
        Название
        <input {...register("name")} placeholder="Название проекта" />
        {error("name")}
      </label>

      <label>
        Описание
        <textarea
          rows="4"
          {...register("description")}
          placeholder="Короткое описание проекта"
        />
        {error("description")}
      </label>

      <label>
        Акцент
        <div className={styles.colorRow}>
          <input type="color" {...register("color")} />
          <span>Нейтральный цвет для идентификации проекта</span>
        </div>
        {error("color")}
      </label>

      <div className={styles.actions}>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Отмена
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Сохранение…" : "Сохранить"}
        </Button>
      </div>
    </form>
  );
}