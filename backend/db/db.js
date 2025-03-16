require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URL = process.env.MONGO_URL;

const DBconnection = ()=>{
    mongoose.connect(MONGO_URL)
    .then(()=>{
        console.log('Connected to database successfully');
    }).catch((e)=>{
        console.log('Error connecting to database');
    })
}

module.exports = DBconnection