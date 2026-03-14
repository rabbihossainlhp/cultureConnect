//dependencies...
const authRouter = require('./auth.routes');


const routesWithPaths = [
    {
        path:'/api/auth',
        handler: authRouter
    },

]



const useRoutes = (app) =>{

    routesWithPaths.map(route =>{
        console.log(`Registering route: ${route.path}`)
        app.use(route.path, route.handler);
    });
};



module.exports = useRoutes;