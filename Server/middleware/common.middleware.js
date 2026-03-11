const express = require('express');
const morgan = require('morgan');
const cors = require('cors');




const middlewares = [
    morgan('dev'),
    express.json(),
    cors({
        origin:true,
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