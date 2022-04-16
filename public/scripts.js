const chatArea = $('#chat-area');
const inputArea = $('#input-msg');
const sendBtn = $('#send-btn');
const chatForm = $('#chat-form');
const socket =  io();

socket.on('message',message=>{
    console.log(message)
});


chatForm.submit( (e)=> { 
    e.preventDefault();
    let chat_msg = inputArea.val()
    inputArea.empty()
    console.log(chat_msg) 
});

// inputArea.focus(()=>{
//     inputArea.attr('placeholder')
// })