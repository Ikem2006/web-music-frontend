const baseURL = "https://web-music-proj.onrender.com"; 
const token = localStorage.getItem("access_token");
const role = localStorage.getItem("role");

if (!token || !role) {
  alert("Unauthorized. Please login.");
  window.location.href = "../html/login.html";
}

// Handle role-based links
const artistLink = document.getElementById("artist-link");
if (role === "user") artistLink.href = "user_artist.html";
else if (role === "musician") artistLink.href = "musician_artist.html";
else if (role === "admin") artistLink.href = "admin_artist.html";

// Handle role-based links
const accountLink = document.getElementById("account-link");
if (role === "user") accountLink.href = "user_account.html";
else if (role === "musician") accountLink.href = "musician_account.html";
else if (role === "admin") accountLink.href = "admin_account.html";

// Handle role-based links
const HomeLink = document.getElementById("home-link");
if (role === "user") HomeLink.href = "user_home.html";
else if (role === "musician") HomeLink.href = "musician_home.html";
else if (role === "admin") HomeLink.href = "admin_home.html";


const socket = io(baseURL);

const clientList = document.getElementById("client-list");
const chatArea = document.getElementById("chat-area");
const chatMessages = document.getElementById("chat-messages");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");
let currentRoom = null;

// Load all clients (mocking redis room keys here)
async function loadClients() {
  const res = await fetch(`${baseURL}/${role}/get_users`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  clientList.innerHTML = "";
  Object.values(data).forEach((user) => {
    const card = document.createElement("div");
    card.className = "client-card";
    card.innerHTML = `
      <img src="../img/imgage.jpeg" />
      <div>
        <h3>${user.username}</h3>
        <p>${user.email}</p>
      </div>
    `;
    card.onclick = () => {
      currentRoom = user.username;
      document.getElementById("chat-header").textContent = `Chatting with ${user.username}`;
      chatArea.classList.remove("hidden");
      chatMessages.innerHTML = "";

      socket.emit("join_room", { id: currentRoom, role: role });
    };

    clientList.appendChild(card);
  });
}

sendBtn.onclick = () => {
  const msg = chatInput.value;
  if (!msg || !currentRoom) return;

  socket.emit("send_message", {
    message: `${role}: ${msg}`,
    room: currentRoom,
    role: role,
  });

  chatMessages.innerHTML += `<p><strong>You:</strong> ${msg}</p>`;
  chatInput.value = "";
};

socket.on("receive_message", (msg) => {
  chatMessages.innerHTML += `<p>${msg}</p>`;
});

document.getElementById("search-bar").addEventListener("input", function () {
  const query = this.value.toLowerCase();
  const cards = document.querySelectorAll(".client-card");

  cards.forEach((card) => {
    const name = card.querySelector("h3").textContent.toLowerCase();
    card.style.display = name.includes(query) ? "flex" : "none";
  });
});

document.addEventListener("DOMContentLoaded", loadClients);
