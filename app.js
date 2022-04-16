const express = require("express");
const app = express();
const http = require('http');
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);
const path = require("path");

const port = process.env.port ||3000;

app.use(express.json())
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname + "/public")));

app.get('/',(req,res,next)=>{
    res.render('home');
})
io.on('connection',socket=>{

    //for only the sender 
    socket.emit('message','welcom bud')
    ///for all except sender 
    socket.broadcast.emit();
    //for every body
    io.emit();
    //when close 
    socket.on('disconnect',()=>{
        io.emit('message','a user disconnected');
    })
})
app.use((err,req,res,next)=>{
    res.status(402).send({error:err.message})
})
server.listen(port, () => {
    console.log(`app started on port ${port}`);
  });
  