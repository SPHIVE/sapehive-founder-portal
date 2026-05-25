import type { Route } from "./+types/home";
import { LoginScreen } from "~/components/login-screen/login-screen";
import { PortalLayout } from "~/components/portal-layout/portal-layout";
import { useAuth } from "~/hooks/use-auth";
import styles from "./home.module.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sapehive | Internal Portal" },
    { name: "description", content: "Sapehive internal founders portal — authorized members only." },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function Home() {
  const { isAuthenticated, login, logout } = useAuth();

  return (
    <div className={styles.home}>
      {isAuthenticated ? (
        <PortalLayout onLogout={logout} />
      ) : (
        <LoginScreen onLogin={login} />
      )}
    </div>
  );
}
