const socket = io();

const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");
const room = document.getElementById("room");
const roomForm = room.querySelector("form");
const roomTitle = room.querySelector("h3");

roomTitle.hidden = true;
room.hidden = true;

let roomName;

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = roomForm.querySelector("input");
  const value = input.value;
  socket.emit("new_message", value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  roomTitle.hidden = false;
  roomTitle.innerText = `Room ${roomName}`;
  roomForm.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = welcomeForm.querySelector("input");
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
}

welcomeForm.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", () => {
  addMessage("Someone joined 😀");
});

socket.on("bye", () => {
  addMessage("Someone left 🥲");
});

socket.on("new_message", addMessage);
