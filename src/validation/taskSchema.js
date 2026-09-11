import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().trim().min(3, "Введите минимум 3 символа").max(100, "Максимум 100 символов"),
  description: z.string().trim().min(10, "Введите минимум 10 символов").max(1000, "Максимум 1000 символов"),
  status: z.enum(["todo", "in-progress", "done"]),
  priority: z.enum(["low", "medium", "high"]),
  projectId: z.string().min(1, "Выберите проект"),
  dueDate: z.string().min(1, "Выберите срок")
});
