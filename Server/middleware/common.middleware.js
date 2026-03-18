const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');




const middlewares = [
    morgan('dev'),
    express.json(),
    cors({
        origin:['http://localhost:5173'],
        credentials:true,
        methods:['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    }),
    cookieParser(),
];



const useMiddleware = (app) =>{
    middlewares.map(middleware=>{
        app.use(middleware);
    });
};


module.exports = useMiddleware;