import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

import("posthog-js").then(({ default: posthog }) => {
  const key = import.meta.env.VITE_POSTHOG_KEY;
  if (key) {
    posthog.init(key, {
      api_host: "https://us.i.posthog.com",
      person_profiles: "always",
    });
  }
});

createRoot(document.getElementById("root")!).render(<App />);

// Signal the splash screen to fade out now that React has rendered.
// The splash enforces its own 1.2 s minimum, so calling this early is safe.
if (typeof (window as any).__etHideSplash === "function") {
  (window as any).__etHideSplash();
}
