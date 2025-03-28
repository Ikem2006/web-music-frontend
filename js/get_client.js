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
  const currentAdmin = localStorage.getItem("username");
  let allClients = [];

  try {
    const [usersRes, musiciansRes, adminsRes] = await Promise.all([
      fetch(`${BASE_URL}/admin/get_users`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${BASE_URL}/admin/get_musicians`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${BASE_URL}/admin/get_all_admin`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    const usersData = await usersRes.json();
    const musiciansData = await musiciansRes.json();
    const adminsData = await adminsRes.json();

    const users = Object.values(usersData || {}).map((u) => ({
      ...u,
      name: u.username || u.name || "Unnamed",
      role: "user",
    }));

    const musicians = Object.values(musiciansData || {}).map((m) => ({
      ...m,
      name: m.musician_name || "Unnamed",
      role: "musician",
    }));

    const admins = Object.values(adminsData || {}).map((a) => ({
      ...a,
      name: a.username || a.name || "Unnamed",
      role: "admin",
    }));

    allClients = [...users, ...musicians, ...admins];

    renderClients(allClients);

    searchInput.addEventListener("input", () => {
      const term = searchInput.value.toLowerCase();
      const filtered = allClients.filter((c) =>
        c.name.toLowerCase().includes(term)
      );
      renderClients(filtered);
    });
  } catch (err) {
    alert("Failed to load clients.");
    console.error("Client loading error:", err);
  }

  function renderClients(clients) {
    container.innerHTML = "";
    if (clients.length === 0) {
      container.innerHTML = "<p>No clients found.</p>";
      return;
    }

    clients.forEach((client) => {
      const card = document.createElement("div");
      card.className = "client-card";
      card.innerHTML = `
        <img src="../img/imgage.jpeg" alt="${client.name}">
        <h3>${client.name}</h3>
        <p>${client.role}</p>
        ${
          client.role !== "admin" || client.name !== currentAdmin
            ? `<button class="delete-btn" onclick="deleteClient('${client.role}', '${client.name}')">🗑️</button>`
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
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const result = await res.json();
    alert(result.message);
    location.reload();
  } catch (err) {
    alert("Failed to delete client.");
    console.error(err);
  }
}
