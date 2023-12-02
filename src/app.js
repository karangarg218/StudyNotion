const express = require('express')
const app = express();
const {PORT} = require('./config/serverConfig')
const dbConnection = require('./config/database')

async function startServer(){
 try{
    await dbConnection.connect();
    app.listen(PORT,()=>{
        console.log(`App is Started on Port ${PORT}`)
    })
}catch(Error){
    console.error(`error connecting to db`,error)
}
}
startServer();