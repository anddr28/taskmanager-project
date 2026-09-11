import {
  STATUS_OPTIONS,
  PRIORITY_OPTIONS,
  SORT_OPTIONS
} from "../../utils/constants";
import styles from "./TaskFilters.module.css";

export default function TaskFilters({ filters, onChange, projects, authors }) {
  return (
    <div className={styles.filters}>
      <div className={styles.search}>
        <span>⌕</span>
        <input
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
          placeholder="Поиск задач…"
          aria-label="Поиск задач"
        />
      </div>

      <select
        value={filters.status}
        onChange={(e) => onChange({ status: e.target.value })}
        aria-label="Статус"
      >
        <option value="">Статус</option>
        {STATUS_OPTIONS.map((x) => (
          <option key={x.value} value={x.value}>{x.label}</option>
        ))}
      </select>

      <select
        value={filters.priority}
        onChange={(e) => onChange({ priority: e.target.value })}
        aria-label="Приоритет"
      >
        <option value="">Приоритет</option>
        {PRIORITY_OPTIONS.map((x) => (
          <option key={x.value} value={x.value}>{x.label}</option>
        ))}
      </select>

      <select
        value={filters.projectId}
        onChange={(e) => onChange({ projectId: e.target.value })}
        aria-label="Проект"
      >
        <option value="">Проект</option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>{project.name}</option>
        ))}
      </select>

      <select
        value={filters.authorId}
        onChange={(e) => onChange({ authorId: e.target.value })}
        aria-label="Автор"
      >
        <option value="">Автор</option>
        {authors.map((author) => (
          <option key={author.id} value={author.id}>{author.name}</option>
        ))}
      </select>

      <select
        value={filters.sort}
        onChange={(e) => onChange({ sort: e.target.value })}
        aria-label="Сортировка"
      >
        {SORT_OPTIONS.map((x) => (
          <option key={x.value} value={x.value}>{x.label}</option>
        ))}
      </select>
    </div>
  );
}