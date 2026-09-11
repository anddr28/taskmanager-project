import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Введите корректный email"),
  password: z.string().min(6, "Минимум 6 символов")
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Минимум 2 символа").max(60, "Имя слишком длинное"),
  email: z.string().trim().email("Введите корректный email"),
  password: z.string().min(6, "Минимум 6 символов"),
  confirmPassword: z.string().min(6, "Повторите пароль")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"]
});