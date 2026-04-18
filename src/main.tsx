import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import ErrorBoundary from "@/components/ErrorBoundary";
import { installGlobalErrorReporter } from "@/lib/errorReporter";
import { installSWRegistration } from "@/lib/swUpdate";
import "./index.css";

// Chunk 8 F-1/F-2: prompt-based SW updates so we don't hot-swap the user
// mid-session. UpdateToast (rendered inside App) handles the "new version
// available" banner and suppresses it while a mock exam is running.
installSWRegistration();

// E-4: capture uncaught errors and unhandled rejections into IDB so they
// can be exported from Settings. Strictly local; nothing leaves the device.
installGlobalErrorReporter();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <HashRouter>
        <App />
      </HashRouter>
    </ErrorBoundary>
  </React.StrictMode>,
);
