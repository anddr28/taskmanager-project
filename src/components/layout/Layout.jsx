import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import styles from "./Layout.module.css";

const items = [
  { to: "/", label: "Обзор", end: true },
  { to: "/tasks", label: "Задачи" },
  { to: "/projects", label: "Проекты" }
];

function Navigation({ mobile = false }) {
  return (
    <nav className={mobile ? undefined : styles.nav} aria-label="Основная навигация">
      {!mobile && <div className={styles.navLabel}>Навигация</div>}
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            mobile
              ? isActive ? styles.mobileActive : undefined
              : `${styles.navItem} ${isActive ? styles.active : ""}`
          }
        >
          {!mobile && <span className={styles.dot} aria-hidden="true" />}
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

export default function Layout() {
  const { user, logout } = useAuth();
  const initial = user?.name?.slice(0, 1).toUpperCase() || "U";

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div>
          <NavLink to="/" className={styles.brand} aria-label="TaskManager, обзор">
            <span className={styles.mark}>T</span>
            <span>TaskManager</span>
          </NavLink>
          <Navigation />
        </div>

        <div className={styles.bottom}>
          <div className={styles.user}>
            <span className={styles.avatar} aria-hidden="true">{initial}</span>
            <div className={styles.userText}>
              <strong>{user?.name}</strong>
              <span>{user?.email}</span>
            </div>
          </div>
          <button className={styles.logout} type="button" onClick={logout}>
            Выйти
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <header className={styles.mobileBar}>
          <NavLink to="/" className={styles.mobileBrand}>TaskManager</NavLink>
          <Navigation mobile />
          <button type="button" onClick={logout}>Выйти</button>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
