const socket = io();
let name;
let textareea = document.querySelector("#textarea");
let messageArea = document.querySelector(".message_area");

do {
  name = prompt("please enter your name:  ");
} while (!name);

textareea.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    sendMessage(e.target.value);
  }
});

function sendMessage(message) {
  let msg = {
    user: name,
    message: message.trim(),
  };
  // Append the message
  appendMessage(msg, "outgoing");
  textareea.value = "";
  scrollToBottom(); // Fixed typo
  // Send to server
  socket.emit("message", msg);
}

function appendMessage(msg, type) {
  let mainDiv = document.createElement("div");
  let className = type;
  mainDiv.classList.add(className, "message");

  let markup = `
  <h4>${msg.user}</h4>
  <p>${msg.message}</p>
`;

  mainDiv.innerHTML = markup;
  messageArea.appendChild(mainDiv);
}

// Receive message
socket.on("message", (msg) => {
  appendMessage(msg, "incoming");
  scrollToBottom(); // Fixed typo
});

function scrollToBottom() {
  // Fixed typo in function name
  messageArea.scrollTop = messageArea.scrollHeight;
}
