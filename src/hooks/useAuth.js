import { useAuthStore } from "../store/useAuthStore";

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const setSession = useAuthStore((state) => state.setSession);
  const logout = useAuthStore((state) => state.logout);

  return {
    user,
    isAuthenticated: Boolean(user),
    setSession,
    logout
  };
}