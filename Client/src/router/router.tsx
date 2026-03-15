
import Community from "../pages/Deshboard/Community";
import UserDashBoard from "../pages/Deshboard/UserDashBoard/UserDashBoard";
import { createBrowserRouter } from "react-router";
import RootLayOut from "../Layout/RootLayOut";
import DashboardLayout from "../Layout/DashboardLayout";
import Home from "../pages/Home";
import Signup from "../components/auth/Signup";
import Login from "../components/auth/Login";




const publicRoutes = [
  {index:true, Component:Home},
  {path:"community",Component:Community},
  {path:"/signup",Component:Signup},
  {path:"/login",Component:Login},
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
  }
])

export default router;