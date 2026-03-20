//dependencies...
const authRouter = require('./auth.routes');
const profileRouter = require('./profile.router');


const routesWithPaths = [
    {
        path:'/api/auth',
        handler: authRouter
    },

    {
        path:"/api/profile",
        handler:profileRouter
    }
]



const useRoutes = (app) =>{

    routesWithPaths.map(route =>{
        console.log(`Registering route: ${route.path}`)
        app.use(route.path, route.handler);
    });
};



module.exports = useRoutes;