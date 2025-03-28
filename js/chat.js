const SOCKET_URL = "https://web-music-proj.onrender.com";
const socket = io(SOCKET_URL);

const token = localStorage.getItem("access_token");
const role = localStorage.getItem("role");
const username = localStorage.getItem("username");

if (!token || !role || !username) {
  alert("Unauthorized. Please login.");
  window.location.href = "../html/login.html";
}

// Role-based links
const accountLink = document.getElementById("account-link");
if (role === "user") accountLink.href = "user_account.html";
else if (role === "musician") accountLink.href = "musician_account.html";
else if (role === "admin") accountLink.href = "admin_account.html";

const artistLink = document.getElementById("artist-link");
if (role === "user") artistLink.href = "user_artist.html";
else if (role === "musician") artistLink.href = "musician_artist.html";
else if (role === "admin") artistLink.href = "admin_artist.html";

const homeLink = document.getElementById("home-link");
if (role === "user") homeLink.href = "user_home.html";
else if (role === "musician") homeLink.href = "musician_home.html";
else if (role === "admin") homeLink.href = "admin_home.html";


// DOM
const userList = document.getElementById("user-list");
const searchBar = document.getElementById("search-bar");
const chatBox = document.getElementById("chat-box");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");

let currentRoom = null;

// Request active rooms from server
socket.emit("get_active_rooms");

// Listen for response
socket.on("active_rooms", (users) => {
  userList.innerHTML = "";
  users.forEach((user) => {
    if (user.username !== username) {
      const card = document.createElement("div");
      card.className = "user-card";
      card.innerHTML = `
        <img src="../img/imgage.jpeg" alt="${user.username}" />
        <div class="user-info">
          <h3>${user.username}</h3>
          <p>${user.role}</p>
        </div>
      `;
      card.addEventListener("click", () => {
        currentRoom = user.username;
        document.getElementById("chat-room-title").textContent = `Chat with ${user.username}`;
        chatBox.innerHTML = "";
      });
      userList.appendChild(card);
    }
  });
});

// Send message
sendBtn.addEventListener("click", () => {
  const msg = chatInput.value.trim();
  if (msg && currentRoom) {
    socket.emit("send_message", {
      message: { sender: username, text: msg },
      room: currentRoom,
    });

    const li = document.createElement("li");
    li.textContent = `You: ${msg}`;
    chatBox.appendChild(li);
    chatInput.value = "";
  }
});

// Receive message
socket.on("receive_message", (msg) => {
  const li = document.createElement("li");
  li.textContent = `${msg.sender}: ${msg.text}`;
  chatBox.appendChild(li);
});

// Search bar
searchBar.addEventListener("input", function () {
  const query = this.value.toLowerCase();
  const cards = document.querySelectorAll(".user-card");

  cards.forEach((card) => {
    const name = card.querySelector("h3").textContent.toLowerCase();
    card.style.display = name.includes(query) ? "flex" : "none";
  });
});
