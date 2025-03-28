const BASE_URL = "https://web-music-proj.onrender.com";
const socket = io(BASE_URL, { transports: ["websocket"] });

const token = localStorage.getItem("access_token");
const role = localStorage.getItem("role");
const username = localStorage.getItem("username");

if (!token || !role || !username) {
  alert("Unauthorized. Please login.");
  window.location.href = "../html/login.html";
}

const endpoints = {
  user: `${BASE_URL}/user/get_users`,
  musician: `${BASE_URL}/musician/get_users`,
  admin: `${BASE_URL}/admin/get_users`,
};

const artistEndpoints = {
  user: `${BASE_URL}/user/get_musicians`,
  musician: `${BASE_URL}/musician/get_musicians`,
  admin: `${BASE_URL}/admin/get_musicians`,
};

const userList = document.getElementById("user-list");
const chatBox = document.getElementById("chat-box");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");
const searchBar = document.getElementById("search-bar");
const roomTitle = document.getElementById("chat-room-title");

let currentRoom = null;

// Join own room
socket.emit("join_room", { username });

// Fetch all users & musicians
async function loadClients() {
  try {
    const headers = { Authorization: `Bearer ${token}` };

    const [usersRes, musiciansRes] = await Promise.all([
      fetch(endpoints[role], { headers }),
      fetch(artistEndpoints[role], { headers }),
    ]);

    const users = await usersRes.json();
    const musicians = await musiciansRes.json();

    const clients = [...users, ...musicians].filter(client => client.username !== username && client.music_name !== username);

    userList.innerHTML = "";

    clients.forEach((client) => {
      const clientName = client.username || client.music_name;
      const clientRole = client.username ? "user" : "musician";

      const card = document.createElement("div");
      card.className = "user-card";
      card.innerHTML = `
        <img src="../img/imgage.jpeg" />
        <div class="user-info">
          <h3>${clientName}</h3>
          <p>${clientRole}</p>
        </div>
      `;

      card.addEventListener("click", () => {
        currentRoom = clientName;
        roomTitle.textContent = `Chat with ${clientName}`;
        chatBox.innerHTML = "";
      });

      userList.appendChild(card);
    });
  } catch (err) {
    console.error("Error loading clients:", err);
  }
}

loadClients();

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
  if (msg.sender === currentRoom || msg.sender === username) {
    const li = document.createElement("li");
    li.textContent = `${msg.sender}: ${msg.text}`;
    chatBox.appendChild(li);
  }
});

// Search
searchBar.addEventListener("input", function () {
  const query = this.value.toLowerCase();
  const cards = document.querySelectorAll(".user-card");

  cards.forEach((card) => {
    const name = card.querySelector("h3").textContent.toLowerCase();
    card.style.display = name.includes(query) ? "flex" : "none";
  });
});
