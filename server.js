const express = require ('express');
const app = express();
const dotenv = require ('dotenv');
const mongoose = require('mongoose');
dotenv.config();

mongoose.connect("mongodb://127.0.0.1:27017/linkedindb",{useNewUrlParser:true, useUnifiedTopology:true, useFindAndModify:true})
    .then(db=>{
        console.log('mongoose db is live')
    },
     err => console.log('mongoose db failed to connect', err))


const userServices = require('./src/services/users/index');

app.use('/users', userServices);
app.listen(process.env.PORT ,()=>{
    console.log(`server active on port ${process.env.PORT}`);
})