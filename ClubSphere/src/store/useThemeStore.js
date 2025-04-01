import { create } from "zustand";

export const useThemeStore = create((set) => {
  const savedTheme = localStorage.getItem("theme") || "coffee";
  
  // ✅ Apply the saved theme on load
  document.documentElement.setAttribute("data-theme", savedTheme); 

  return {
    theme: savedTheme,
    setTheme: (theme) => {
      localStorage.setItem("theme", theme);
      set({ theme });
      document.documentElement.setAttribute("data-theme", theme); // ✅ Corrected
    },
  };
});
