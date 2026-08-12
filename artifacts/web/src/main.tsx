import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Lazy-load PostHog so it never blocks the first render
import("posthog-js").then(({ default: posthog }) => {
  const key = import.meta.env.VITE_POSTHOG_KEY;
  if (key) {
    posthog.init(key, {
      api_host: "https://us.i.posthog.com",
      person_profiles: "always",
    });
  }
}).catch(() => {
  // PostHog is optional — ignore load errors silently
});

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
