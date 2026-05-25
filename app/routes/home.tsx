import type { Route } from "./+types/home";
import { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { PortalLayout } from "~/components/portal-layout/portal-layout";
import { IntroScreen, hasSeenIntro, markIntroSeen } from "~/components/intro-screen/intro-screen";
import styles from "./home.module.css";

export default function Home() {
  const [showIntro, setShowIntro] = useState(false);
  const [isClientReady, setIsClientReady] = useState(false);

  useEffect(() => {
    setShowIntro(!hasSeenIntro());
    setIsClientReady(true);
  }, []);

  const handleIntroComplete = useCallback(() => {
    markIntroSeen();
    setShowIntro(false);
  }, []);

  return (
    <div className={styles.home}>
      <AnimatePresence>{showIntro && <IntroScreen key="intro" onComplete={handleIntroComplete} />}</AnimatePresence>

      {isClientReady && !showIntro && <PortalLayout onLogout={() => {}} />}
    </div>
  );
}

