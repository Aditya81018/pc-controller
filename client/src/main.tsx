import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import { ThemeProvider } from "@/components/theme-provider";
import Home from "./pages/home.tsx";
import PcControl from "./pages/pc-control.tsx";
import GameControl from "./pages/game-control.tsx";
import Console from "./pages/console.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/pc-control",
    element: <PcControl />,
  },
  {
    path: "/game-control",
    element: <GameControl />,
  },
  {
    path: "/console",
    element: <Console />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
);
