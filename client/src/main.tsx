
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initSentry } from "./lib/sentry";

// Initialize Sentry for error monitoring
initSentry();

createRoot(document.getElementById("root")!).render(<App />);
