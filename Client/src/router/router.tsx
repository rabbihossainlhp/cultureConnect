  import { createBrowserRouter } from "react-router";
import RootLayOut from "../RootLayOut/RootLayOut";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
 
const router = createBrowserRouter([
  {
    path: "/",
  Component:RootLayOut,
  children:[
    {
      index:true,
      Component:Home
    }
  ]
  },

  {
    path:'/*',
  Component:NotFound
  }
]);

export default router