  import { createBrowserRouter } from "react-router";
import RootLayOut from "../rootLayOut/RootLayOut";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import MainDeshboard from "../pages/Deshboard/MainDeshboard/MainDeshboard";
import HomeDeshboard from "../pages/Deshboard/HomeDeshoboard/HomeDeshboard";
 
const router = createBrowserRouter([
  {
    path: "/",
    Component:RootLayOut,
    children:[ {
      index:true,
      Component:Home
    },
 
  
  
  ]
  },



    //main desh board
  {
    path: "/maindeshboard",
    element: (
          <MainDeshboard></MainDeshboard>
    ),
    children: [
      {
        index:true,
        Component: HomeDeshboard,
      },
      {
    path:'homedeshboard',
        Component: HomeDeshboard,
      }

    ],
  },


  {
    path:'/*',
    Component:NotFound
  }
]);

export default router