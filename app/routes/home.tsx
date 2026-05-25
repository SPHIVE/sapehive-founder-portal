import type { Route } from "./+types/home";
import { data, useFetcher } from "react-router";
import { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { LoginScreen } from "~/components/login-screen/login-screen";
import { PortalLayout } from "~/components/portal-layout/portal-layout";
import { IntroScreen, hasSeenIntro, markIntroSeen } from "~/components/intro-screen/intro-screen";
import styles from "./home.module.css";

const AUTH_KEY = "sapehive_auth_v2";

function safeNormalize(value: string): string {
  const trimmed = value.trim();
  try {
    return trimmed.normalize("NFKC");
  } catch {
    return trimmed;
  }
}

function getPortalSecret(): string {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;
  return safeNormalize(env?.PORTAL_PASSWORD ?? "");
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sapehive | Internal Portal" },
    { name: "description", content: "Sapehive — Authorized Members Only." },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

/** Server-side action — password never leaves the server */
export async function action({ request }: Route.ActionArgs) {
  try {
    const formData = await request.formData();
    const attempt = safeNormalize(String(formData.get("password") ?? ""));
    const secret = getPortalSecret();

    if (!secret) {
      return data({ ok: false, reason: "server-misconfigured" as const }, { status: 200 });
    }

    // Intentional: keep password case-sensitive, but ignore accidental surrounding whitespace
    const ok = attempt === secret;
    return data({ ok, reason: ok ? undefined : "invalid-credentials" as const }, { status: 200 });
  } catch {
    // Never bubble runtime errors as 500 for login attempts.
    return data({ ok: false, reason: "auth-runtime-error" as const }, { status: 200 });
  }
}

export default function Home() {
  const fetcher = useFetcher<typeof action>();

  const [showIntro, setShowIntro] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isClientReady, setIsClientReady] = useState(false);

  const [loginState, setLoginState] = useState<"idle" | "loading" | "error" | "config-error">("idle");

  useEffect(() => {
    setShowIntro(!hasSeenIntro());
    setIsAuthenticated(sessionStorage.getItem(AUTH_KEY) === "1");
    setIsClientReady(true);
  }, []);

  useEffect(() => {
    if (fetcher.state === "submitting" || fetcher.state === "loading") {
      setLoginState("loading");
      return;
    }

    if (fetcher.state === "idle") {
      if (!fetcher.data) {
        // Covers network/runtime issues where action response isn't parsed.
        if (fetcher.formData) {
          setLoginState("error");
          setTimeout(() => setLoginState("idle"), 2500);
        }
        return;
      }

      if (fetcher.data.ok) {
        sessionStorage.setItem(AUTH_KEY, "1");
        setIsAuthenticated(true);
        setLoginState("idle");
        return;
      }

      if (fetcher.data.reason === "server-misconfigured") {
        setLoginState("config-error");
      } else {
        setLoginState("error");
        setTimeout(() => setLoginState("idle"), 2500);
      }
    }
  }, [fetcher.state, fetcher.data, fetcher.formData]);

  const handleLogin = (password: string) => {
    if (!isClientReady) return;
    const form = new FormData();
    form.append("password", password);
    fetcher.submit(form, { method: "post" });
  };

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
  };

  const handleIntroComplete = useCallback(() => {
    markIntroSeen();
    setShowIntro(false);
  }, []);

  return (
    <div className={styles.home}>
      <AnimatePresence>{showIntro && <IntroScreen key="intro" onComplete={handleIntroComplete} />}</AnimatePresence>

      {isClientReady && !showIntro &&
        (isAuthenticated ? (
          <PortalLayout onLogout={handleLogout} />
        ) : (
          <LoginScreen
            onLogin={handleLogin}
            loginState={loginState === "config-error" ? "error" : loginState}
            errorMessage={
              loginState === "config-error"
                ? "Portal is temporarily unavailable. Please configure PORTAL_PASSWORD in Vercel env vars."
                : undefined
            }
          />
        ))}
    </div>
  );
}
