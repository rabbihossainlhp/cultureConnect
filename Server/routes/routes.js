const authRouter = require('./auth.routes');


const routesWithPaths = [
    {
        path:'/api/auth',
        handler: authRouter
    },

]



const useRoutes = (app) =>{
    routesWithPaths.map(route =>{
        app.use(route.path, route.handler);
    });
};



module.exports = useRoutes;