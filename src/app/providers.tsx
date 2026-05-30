import { useEffect } from "react";

import type { ReactNode } from "react";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

interface ProvidersProps {
  children?: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  useEffect(() => {
    const handleInstall = () => {
      if (typeof window.gtag === "function") {
        window.gtag("event", "pwa_install");
      }
    };
    window.addEventListener("appinstalled", handleInstall);
    return () => {
      window.removeEventListener("appinstalled", handleInstall);
    };
  }, []);

  return <>{children}</>;
}
