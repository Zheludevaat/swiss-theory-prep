import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { registerSW } from "virtual:pwa-register";
import App from "./App";
import ErrorBoundary from "@/components/ErrorBoundary";
import { installGlobalErrorReporter } from "@/lib/errorReporter";
import "./index.css";

// Auto-update on reload — safe for a single-user app.
registerSW({ immediate: true });

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
