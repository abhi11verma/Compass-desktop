import type { ReactNode } from "react";

interface ProvidersProps {
  children?: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // Add global providers here (React Query, Router, Theme, etc.)
  return <>{children}</>;
}
