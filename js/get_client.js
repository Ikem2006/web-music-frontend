const BASE_URL = "https://web-music-proj.onrender.com";

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");

  if (!token || role !== "admin") {
    alert("Unauthorized access. Redirecting to login...");
    window.location.href = "../html/login.html";
    return;
  }

  const container = document.getElementById("clients-container");
  const searchInput = document.getElementById("search-input");

  let allClients = [];

  try {
    const [usersRes, musiciansRes, adminsRes] = await Promise.all([
      fetch(`${BASE_URL}/admin/get_users`, { headers: { Authorization: `Bearer ${token}` }}),
      fetch(`${BASE_URL}/admin/get_musicians`, { headers: { Authorization: `Bearer ${token}` }}),
      fetch(`${BASE_URL}/admin/get_all_admin`, { headers: { Authorization: `Bearer ${token}` }})
    ]);

    const users = await usersRes.json();
    const musicians = await musiciansRes.json();
    const admins = await adminsRes.json();

    allClients = [
      ...users.map(user => ({ ...user, role: "user" })),
      ...musicians.map(m => ({ ...m, role: "musician" })),
      ...admins.map(a => ({ ...a, role: "admin" })),
    ];

    renderClients(allClients);

    searchInput.addEventListener("input", () => {
      const searchTerm = searchInput.value.toLowerCase();
      const filtered = allClients.filter(client =>
        client.username?.toLowerCase().includes(searchTerm) ||
        client.musician_name?.toLowerCase().includes(searchTerm)
      );
      renderClients(filtered);
    });

  } catch (err) {
    alert("Failed to load clients.");
    console.error(err);
  }

  function renderClients(clients) {
    container.innerHTML = "";
    const currentAdmin = localStorage.getItem("username");

    clients.forEach(client => {
      const name = client.username || client.musician_name || "Unknown";
      const card = document.createElement("div");
      card.className = "client-card";
      card.innerHTML = `
        <img src="../img/imgage.jpeg" alt="${name}">
        <h3>${name}</h3>
        <p>${client.role}</p>
        ${
          client.role !== "admin" || client.username !== currentAdmin
            ? `<button class="delete-btn" onclick="deleteClient('${client.role}', '${name}')">🗑️</button>`
            : ""
        }
      `;
      container.appendChild(card);
    });
  }
});

async function deleteClient(role, username) {
  const password = prompt(`Enter your password to delete ${username}`);
  if (!password) return;

  const token = localStorage.getItem("access_token");

  const routes = {
    user: "delete_user_details",
    musician: "delete_musician_details",
    admin: "delete_admin_details",
  };

  const body = {
    password,
    user_to_delete: username,
  };

  try {
    const res = await fetch(`${BASE_URL}/admin/${routes[role]}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const result = await res.json();
    alert(result.message);
    location.reload();
  } catch (err) {
    alert("Failed to delete client.");
    console.error(err);
  }
}
