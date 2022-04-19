const chatArea = $("#chat-area");
const inputArea = $("#input-msg");
const sendBtn = $("#send-btn");
const chatForm = $("#chat-form");
const messageBox = $("#message-group");
let users;
let user = "unknown";
let s_id;
const socket = io();
//get users data
// jQuery.ajaxSetup({
//     cache: false
// });
const getAllUsers = () => {
  let users;
  $.ajax({
    url: "/file",
    success: (res) => {
      users = res;
      getUser(s_id, users);
    },
    error: (err) => {
      errors = err;
    },
  });
};
///////////////////////

socket.on("connect", () => {
  //   user = getFileData(socket.id);
  s_id = socket.id;
  getFileData();
});
socket.on("message", (message) => {
  appendMessage(message);
  chatArea.scrollTop(chatArea.prop("scrollHeight"));
});
socket.on("online-msg", (message) => {
//   console.log("msg", message);
//   user = { userName: message.sender, user_id: message.sender_id };
//   console.log("user", user);
  chatArea.append(welcomMessageStructure(message));
  chatArea.scrollTop(chatArea.prop("scrollHeight"));
});

socket.on("offline-msg", (message) => {
  chatArea.append(disconnectMessageStructure(message));
  chatArea.scrollTop(chatArea.prop("scrollHeight"));
});

chatForm.submit((e) => {
  e.preventDefault();
  let chat_msg = inputArea.val();
//   message = user;
let message ={};
  message["body"] = chat_msg;
  inputArea.val("");
  socket.emit("send-msg", message);
});
const getFileData = () => {
  getAllUsers();
};
const getUser = (id, users) => {
  user = users.filter((ele) => ele.user_id == id);
  if (user.length > 0) user = user[0];
  return user;
};
function appendMessage(message) {
//   console.log("m", message);
  chatArea.append(messageStructure(message));
}
const findSender = (id) => {
    console.log(id,s_id)
    console.log(users)
};
const messageStructure = (msg) => {
  return ` <div class="mt-1 d-flex flex-column justify-content-end align-items-end "message-group">
            <div class="alert alert-info p-1  mb-0" role="alert" >
                ${msg.body}
            </div>
            <span class="badge bg-light text-dark  ">${msg.time} | today</span>
        </div>`;
};
const welcomMessageStructure = (msg) => {
  return ` <div class=" d-flex flex-column justify-content-center align-items-center message-group">
            <div class="w-100 alert alert-dark p-1  mb-0" role="alert" >
                ${msg}
            </div>
        </div>`;
};

const disconnectMessageStructure = (msg) => {
  return ` <div class=" d-flex flex-column justify-content-center align-items-center message-group">
            <div class="w-100 alert alert-warning p-1  mb-0" role="alert" >
                ${msg}
            </div>
        </div>`;
};

