
import Community from "../pages/Community";
import UserDashBoard from "../pages/Deshboard/UserDashBoard/UserDashBoard";
import { createBrowserRouter, Navigate } from "react-router";
import RootLayOut from "../Layout/RootLayOut";
import DashboardLayout from "../Layout/DashboardLayout";
import Auth from "../pages/Auth";
import Login from "../components/auth/Login";
import Signup from "../components/auth/Signup";
import VerifyEmail from "../pages/VerifyEmail";
import NotFound from "../pages/NotFound";
import Explore from "../pages/Explore";
import SinglePost from "../pages/SinglePost";
import HomeGate from "./HomeGate";
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";
import LiveRooms from "../pages/LiveRooms/LiveRooms";
import Missions from "../pages/Learn/Missions";
import Languages from "../pages/Learn/Languages";
import Profile from "../pages/Profile";




const publicRoutes = [
  {index:true, Component:HomeGate},
  {path:"community",Component:Community},
  {path:"explore",Component:Explore},
  {path:"explore/:slug",Component:SinglePost},
  {path:"live-rooms",Component:LiveRooms},
  {path:"profile", Component:Profile},
  {path:"verify-email", Component:VerifyEmail},
  {
    path:"learn",
    children:[
      {path:"missions", Component:Missions},
      {path:"languages", Component:Languages},
    ]
  },
  {
    path:"/auth",
    element:<GuestRoute><Auth/></GuestRoute>,
    children:[
      {index:true, element:<Navigate to="login" replace/>},
      {path:"login", element:<GuestRoute><Login/></GuestRoute>},
      {path:"signup", element:<GuestRoute><Signup/></GuestRoute>},
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
    element:<ProtectedRoute> <DashboardLayout/></ProtectedRoute>,
    children:dashboardRoutes
  },

  {
    path:"*",
    Component:NotFound
  }
])

export default router;