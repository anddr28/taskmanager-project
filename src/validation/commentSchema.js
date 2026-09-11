import { z } from "zod";

export const commentSchema = z.object({
  comment: z
    .string()
    .trim()
    .min(1, "Введите комментарий")
    .max(500, "Максимум 500 символов")
});
