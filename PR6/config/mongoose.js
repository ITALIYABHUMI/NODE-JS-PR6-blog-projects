const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/pr6');

const db = mongoose.connection;

db.on('connect',(err)=>{
    if(err){
        console.log("db is not connected");;
        return false;
    }
    console.log("db is connected");
})

module.exports= db;