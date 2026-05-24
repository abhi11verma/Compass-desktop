import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "@/App";

import "@/index.css";
import "@/styles/tokens.css";
import "@/styles/base.css";
import "@/styles/topbar.css";
import "@/styles/layout.css";
import "@/styles/focus-card.css";
import "@/styles/what-view.css";
import "@/styles/who-view.css";
import "@/styles/overlays/capture.css";
import "@/styles/overlays/focus-detail.css";
import "@/styles/overlays/habit-detail.css";
import "@/styles/overlays/inbox.css";
import "@/styles/overlays/principle-detail.css";
import "@/styles/overlays/settings.css";
import "@/styles/responsive.css";
import "@/styles/platform.css";
import "@/styles/pwa.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element #root not found");

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
