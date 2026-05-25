import type { Route } from "./+types/home";
import { data, useFetcher } from "react-router";
import { useState, useEffect } from "react";
import { LoginScreen } from "~/components/login-screen/login-screen";
import { PortalLayout } from "~/components/portal-layout/portal-layout";
import styles from "./home.module.css";

const AUTH_KEY = "sapehive_auth_v2";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sapehive | Internal Portal" },
    { name: "description", content: "Sapehive — Authorized Members Only." },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

/** Server-side action — password never leaves the server */
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const attempt = String(formData.get("password") ?? "");
  const secret = process.env.PORTAL_PASSWORD ?? "";

  if (!secret) {
    // env not configured — fail closed
    return data({ ok: false }, { status: 500 });
  }

  const ok = attempt === secret;
  return data({ ok });
}

export default function Home() {
  const fetcher = useFetcher<typeof action>();

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(AUTH_KEY) === "1";
  });

  const [loginState, setLoginState] = useState<"idle" | "loading" | "error">("idle");

  // When server responds
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.ok) {
        sessionStorage.setItem(AUTH_KEY, "1");
        setIsAuthenticated(true);
        setLoginState("idle");
      } else {
        setLoginState("error");
        setTimeout(() => setLoginState("idle"), 2500);
      }
    }
    if (fetcher.state === "submitting" || fetcher.state === "loading") {
      setLoginState("loading");
    }
  }, [fetcher.state, fetcher.data]);

  const handleLogin = (password: string) => {
    const form = new FormData();
    form.append("password", password);
    fetcher.submit(form, { method: "post" });
  };

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
  };

  return (
    <div className={styles.home}>
      {isAuthenticated ? (
        <PortalLayout onLogout={handleLogout} />
      ) : (
        <LoginScreen onLogin={handleLogin} loginState={loginState} />
      )}
    </div>
  );
}
