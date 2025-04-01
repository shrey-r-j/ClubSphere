import "./App.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/route"; 
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";

function App() {
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme); 
  }, [theme]);

  return <RouterProvider router={router} />;
}

export default App;
