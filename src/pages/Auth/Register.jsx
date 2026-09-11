import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../../validation/authSchema";
import { authApi } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import AuthLayout from "../../components/auth/AuthLayout";
import Button from "../../components/ui/Button";
import styles from "../../components/auth/AuthForm.module.css";

export default function Register() {
  const { isAuthenticated, setSession } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(registerSchema)
  });

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const submit = async (values) => {
    setServerError("");

    try {
      const email = values.email.trim().toLowerCase();
      const exists = await authApi.findByEmail(email);

      if (exists) {
        setServerError("Пользователь с таким email уже существует.");
        return;
      }

      const user = await authApi.register({
        id: crypto.randomUUID(),
        name: values.name,
        email,
        password: values.password,
        role: "user"
      });

      setSession({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      });

      navigate("/", { replace: true });
    } catch (error) {
      setServerError(`Не удалось зарегистрироваться: ${error.message}`);
    }
  };

  return (
    <AuthLayout
      title="Создать аккаунт"
      subtitle="Создайте рабочее пространство и начните управлять задачами."
      footer="Войти"
      footerLink="/login"
      footerText="Уже есть аккаунт?"
    >
      <form className={styles.form} onSubmit={handleSubmit(submit)} noValidate>
        <label className={styles.field}>
          Имя
          <input
            autoComplete="name"
            {...register("name")}
            placeholder="Ваше имя"
          />
          {errors.name && (
            <span className={styles.error}>{errors.name.message}</span>
          )}
        </label>

        <label className={styles.field}>
          Email
          <input
            type="email"
            autoComplete="email"
            {...register("email")}
            placeholder="you@example.com"
          />
          {errors.email && (
            <span className={styles.error}>{errors.email.message}</span>
          )}
        </label>

        <label className={styles.field}>
          Пароль
          <input
            type="password"
            autoComplete="new-password"
            {...register("password")}
            placeholder="Минимум 6 символов"
          />
          {errors.password && (
            <span className={styles.error}>{errors.password.message}</span>
          )}
        </label>

        <label className={styles.field}>
          Повторите пароль
          <input
            type="password"
            autoComplete="new-password"
            {...register("confirmPassword")}
            placeholder="Введите пароль ещё раз"
          />
          {errors.confirmPassword && (
            <span className={styles.error}>
              {errors.confirmPassword.message}
            </span>
          )}
        </label>

        {serverError && (
          <div className={styles.serverError}>{serverError}</div>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Создание…" : "Создать аккаунт"}
        </Button>
      </form>
    </AuthLayout>
  );
}