import React from "react";
import ReactDOM from "react-dom/client";
// These styles apply to every route in the application

import App from "./App.tsx";
import "./globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
