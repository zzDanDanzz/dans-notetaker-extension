import React from "react";
import ReactDOM from "react-dom/client";
import Popup from "./components/popup";
import { isDevMode } from "./lib/is-dev-mode";
import "./styles/global.css";

if (isDevMode()) document.body.classList.add("dev-mode");

let root = document.getElementById("root") as HTMLElement;

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
