
import Community from "../pages/Community";
import UserDashBoard from "../pages/Deshboard/UserDashBoard/UserDashBoard";
import { createBrowserRouter, Navigate } from "react-router";
import RootLayOut from "../Layout/RootLayOut";
import DashboardLayout from "../Layout/DashboardLayout";
import Home from "../pages/Home";
import Auth from "../pages/Auth";
import Login from "../components/auth/Login";
import Signup from "../components/auth/Signup";
import NotFound from "../pages/NotFound";




const publicRoutes = [
  {index:true, Component:Home},
  {path:"community",Component:Community},
  {
    path:"/auth",
    Component:Auth,
    children:[
      {index:true, element:<Navigate to="login" replace/>},
      {path:"login", Component:Login},
      {path:"signup", Component:Signup}
    ]
  },
]


const dashboardRoutes = [
  {index:true, Component:UserDashBoard},
]


const router = createBrowserRouter([
  {
    path:"/",
    Component:RootLayOut,
    children:publicRoutes
  },

  {
    path:"/dashboard",
    Component:DashboardLayout,
    children:dashboardRoutes
  },

  {
    path:"*",
    Component:NotFound
  }
])

export default router;