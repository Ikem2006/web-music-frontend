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

const artistLink = document.getElementById("artist-link");
if (role === "user") artistLink.href = "user_artist.html";
else if (role === "musician") artistLink.href = "musician_artist.html";
else if (role === "admin") artistLink.href = "admin_artist.html";

// Handle role-based links
const HomeLink = document.getElementById("home-link");
if (role === "user") HomeLink.href = "user_home.html";
else if (role === "musician") HomeLink.href = "musician_home.html";
else if (role === "admin") HomeLink.href = "admin_home.html";