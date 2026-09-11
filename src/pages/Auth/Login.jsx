import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../validation/authSchema";
import { authApi } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import AuthLayout from "../../components/auth/AuthLayout";
import Button from "../../components/ui/Button";
import styles from "../../components/auth/AuthForm.module.css";

export default function Login() {
  const { isAuthenticated, setSession } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(loginSchema)
  });

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const submit = async (values) => {
    setServerError("");

    try {
      const email = values.email.trim().toLowerCase();
      const user = await authApi.findUser(email, values.password);

      if (!user) {
        setServerError("Неверный email или пароль.");
        return;
      }

      setSession({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      });

      navigate("/", { replace: true });
    } catch (error) {
      setServerError(`Не удалось войти: ${error.message}`);
    }
  };

  return (
    <AuthLayout
      title="Войти"
      subtitle="Введите данные учётной записи, чтобы продолжить."
      footer="Создать аккаунт"
      footerLink="/register"
      footerText="Нет аккаунта?"
    >
      <form className={styles.form} onSubmit={handleSubmit(submit)} noValidate>
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
            autoComplete="current-password"
            {...register("password")}
            placeholder="Введите пароль"
          />
          {errors.password && (
            <span className={styles.error}>{errors.password.message}</span>
          )}
        </label>

        {serverError && (
          <div className={styles.serverError}>{serverError}</div>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Вход…" : "Войти"}
        </Button>

        <p className={styles.demo}>
          Демо: demo@taskmanager.local / demo123
        </p>
      </form>
    </AuthLayout>
  );
}