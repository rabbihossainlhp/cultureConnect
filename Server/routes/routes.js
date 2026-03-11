//dependencies...
console.log('loading routes.js')

const authRouter = require('./auth.routes');

console.log("auth route", authRouter)


const routesWithPaths = [
    {
        path:'/api/auth',
        handler: authRouter
    },

]



const useRoutes = (app) =>{
    app.use('/api/auth', (req,res,next)=>{
        console.log("Hit /api/auth route:",req.method , req.path)
        next();
    })
    routesWithPaths.map(route =>{
        console.log(`Registering route: ${route.path}`)
        app.use(route.path, route.handler);
    });
};



module.exports = useRoutes;