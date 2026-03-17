const express = require('express');
const morgan = require('morgan');
const cors = require('cors');




const middlewares = [
    morgan('dev'),
    express.json(),
    cors({
        origin:['http://localhost:5173'],
        credentials:true,
        methods:['GET','POST','PUT','PATCH','DELETE','OPTION'],
    })
];



const useMiddleware = (app) =>{
    middlewares.map(middleware=>{
        app.use(middleware);
    });
};


module.exports = useMiddleware;