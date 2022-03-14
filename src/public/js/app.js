const socket = io();

const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");
const room = document.getElementById("room");
const msgForm = room.querySelector("#msg");
const roomNameForm = room.querySelector("#name");
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
  const input = msgForm.querySelector("input");
  const value = input.value;
  socket.emit("new_message", value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}

function handleNickNameSubmit() {
  event.preventDefault();
  const input = roomNameForm.querySelector("input");
  const value = input.value;
  socket.emit("nickname", value);
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  roomTitle.hidden = false;
  roomTitle.innerText = `Room ${roomName}`;
  msgForm.addEventListener("submit", handleMessageSubmit);
  roomNameForm.addEventListener("submit", handleNickNameSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = welcomeForm.querySelector("input");
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
}

welcomeForm.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user, newCount) => {
  roomTitle.innerText = `Room ${roomName} (${newCount})`;
  addMessage(`${user} joined 😀`);
});

socket.on("bye", (user, newCount) => {
  roomTitle.innerText = `Room ${roomName} (${newCount})`;
  addMessage(`${user} left 🥲`);
});

socket.on("new_message", addMessage);

socket.on("room_change", (rooms) => {
  const roomList = welcome.querySelector("ul");
  roomList.innerText = "";
  if (rooms.length === 0) {
    roomList.innerText = "";
    return;
  }
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li);
  });
});
