import './App.css'
import { RouterProvider } from "react-router-dom";
import router from "./routes/route"; 
import { useThemeStore } from './store/useThemeStore'


function App() {
  const {theme} = useThemeStore();
  
  return (
    <div data-theme={theme}>
      <RouterProvider router={router}/>
    </div>
  )
}


export default App
