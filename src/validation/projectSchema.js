import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().trim().min(2, "Введите минимум 2 символа").max(80, "Максимум 80 символов"),
  description: z.string().trim().min(10, "Введите минимум 10 символов").max(300, "Максимум 300 символов"),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Некорректный цвет")
});