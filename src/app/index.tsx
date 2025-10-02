import ErrorPage from "@/pages/ErrorPage";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@app/styles/index.css";
import { BrowserRouter } from "react-router";
import AppShell from "@/app/layout/AppShell";

export function bootstrap() {
  const root = document.getElementById("root");
  if (!root) {
    return createRoot(document.body).render(<ErrorPage />);
  }

  createRoot(root).render(
    <StrictMode>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </StrictMode>,
  );
}

export default bootstrap;
