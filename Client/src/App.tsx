import { RouterProvider } from "react-router"
import router from './router/router';
import { AuthProvider } from "./contexts/AuthContext"
import { Analytics } from "@vercel/analytics/react"
 
function App() {

  return (
    <>
    <AuthProvider >
      <RouterProvider router={router}/>
      <Analytics />
    </AuthProvider>
    </>
  )
}

export default App
