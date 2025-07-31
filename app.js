const express = require('express');
const app = express();
const registerRoutes = require('./Routes/signup-routes');
const loginRoutes = require('./Routes/login-routes');
const userRoutes = require('./Routes/user-routes');
const logOutRoutes = require('./Routes/logout-routes');
const carRoutes = require('./Routes/car-routes');
app.use(express.json());

app.use('/api', registerRoutes);
app.use('/api', userRoutes);
app.use('/api',carRoutes)
app.use('/api/session',loginRoutes);
app.use('/api/session',logOutRoutes);
app.use('/', (req,res)=>{
    res.send("Hello World");
})

module.exports = app;