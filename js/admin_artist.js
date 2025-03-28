const baseURL = "https://web-music-proj.onrender.com"; 
const token = localStorage.getItem("access_token");
const role = localStorage.getItem("role");

// Redirect if not authenticated
if (!token || !role) {
  alert("Unauthorized. Please login.");
  window.location.href = "../html/login.html";
}

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


// Load all musicians
async function loadMusicians() {
  try {
    const res = await fetch(`${baseURL}/${role}/get_musicians`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error("Failed to fetch musicians");

    const data = await res.json();
    const container = document.getElementById("musician-list");
    container.innerHTML = "";

    Object.values(data).forEach((musician) => {
      const card = document.createElement("div");
      card.className = "musician-card";

      card.innerHTML = `
        <img src="../img/imgage.jpeg" alt="${musician.musician_name}" />
        <div class="musician-info">
          <h3>${musician.musician_name}</h3>
          <p>Genre: ${musician.music_genre}</p>
          <p>Email: ${musician.email}</p>
        </div>
      `;

      card.addEventListener("click", () => {
        localStorage.setItem("selected_musician", JSON.stringify(musician));
        window.location.href = "musician_detail.html";
      });

      container.appendChild(card);
    });
  } catch (err) {
    console.error("Error loading musicians:", err);
    alert("Could not load musicians.");
  }
}

// Search functionality
document.getElementById("search-bar").addEventListener("input", function () {
  const query = this.value.toLowerCase();
  const cards = document.querySelectorAll(".musician-card");

  cards.forEach((card) => {
    const name = card.querySelector("h3").textContent.toLowerCase();
    card.style.display = name.includes(query) ? "flex" : "none";
  });
});

document.addEventListener("DOMContentLoaded", loadMusicians);
