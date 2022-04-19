const express = require("express");
const app = express();
const http = require("http");
const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);
const path = require("path");
const moment = require('moment')
const { faker } = require("@faker-js/faker");
const fs = require("fs");

const port = process.env.port || 3000;
// ============================================
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname + "/public")));
// ============================================
app.get("/", (req, res, next) => {
  res.render("home");
});
app.get("/file", (req, res, next) => {
  obj = fs.readFileSync("./data.json", (err, data) => {
    if (err) console.log(err);
  });
  obj = JSON.parse(obj);
  res.send(obj);
});
app.get("/file", (req, res, next) => {
  obj = fs.readFileSync("./data.json", (err, data) => {
    if (err) console.log(err);
  });
  obj = JSON.parse(obj);
  res.send(obj);
});
// ============================================
io.on("connection", (socket) => {
  let user = createUser(socket.id);
  //   console.log(socket.id);
  //for only the sender
  socket.emit("online-msg",  "you are online");

  ///for all except sender
  socket.broadcast.emit("online-msg","a user jsut enterd the chat") ;

  //for every body
  socket.on("send-msg", (message) => {
      message['time'] = moment().format('h:mm a');
    io.emit("message", message);
  });

  //when close
  socket.on("disconnect", () => {
    io.emit("offline-msg", "a user disconnected");
  });
});

app.use((err, req, res, next) => {
  res.status(402).send({ error: err.message });
});
server.listen(port, () => {
  console.log(`app started on port ${port}`);
});
// ============================================
// ============================================
const constructMesg = (userObj, text) => {
  let msgobj = {
    sender: userObj.userName,
    sender_id: userObj.user_id,
    body: text,
  };
//   console.log('sender',msgobj);
  return msgobj;
};
const createUser = (socketId) => {
  let user = {
    userName: faker.name.firstName(),
    user_id: socketId,
  };
  console.log('user',user);
  ;
  return addUser(user);
};
// const checkUser = (socketId) => {
//     let user= null;
//     if (fs.existsSync("./data.json")) {
//        let obj = fs.readFileSync("./data.json", (err, data) => {
//           if (err) console.log(err);
//         });
//         obj = JSON.parse(obj);
//         user = obj.filter((ele) => ele.user_id == socketId);
//       }
//     console.log('user',user)
//     // addUser(user)
//   };
const addUser = (userObj) => {
  let obj = null;
  if (fs.existsSync("./data.json")) {
    obj = fs.readFileSync("./data.json", (err, data) => {
      if (err) console.log(err);
    });
  }
  if (obj) {
    obj = JSON.parse(obj);
    obj.push(userObj);
  } else {
    obj = [];
    obj.push(userObj);
  }
  fs.writeFile("./data.json", JSON.stringify(obj), (err) => {
    if (err) console.log(err);
  });
  return userObj;
};
