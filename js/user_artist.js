// Base URL for API calls and retrieving the token and role from localStorage
const baseURL = "https://web-music-proj.onrender.com"; 
const token = localStorage.getItem("access_token");
const role = localStorage.getItem("role");

// Redirect to login if not authenticated (no token or role)
if (!token || !role) {
  alert("Unauthorized. Please login.");
  window.location.href = "../html/login.html"; // Redirect to login page
}

// Handle role-based links for account page
const accountLink = document.getElementById("account-link");
if (role === "user") accountLink.href = "user_account.html"; // For user role
else if (role === "musician") accountLink.href = "musician_account.html"; // For musician role
else if (role === "admin") accountLink.href = "admin_account.html"; // For admin role

// Handle role-based links for home page
const HomeLink = document.getElementById("home-link");
if (role === "user") HomeLink.href = "user_home.html"; // For user role
else if (role === "musician") HomeLink.href = "musician_home.html"; // For musician role
else if (role === "admin") HomeLink.href = "admin_home.html"; // For admin role

// Function to load all musicians from the server
async function loadMusicians() {
  try {
    // Fetching the musicians based on the user's role (user, musician, or admin)
    const res = await fetch(`${baseURL}/${role}/get_musicians`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Attach the token to the request for authentication
        "Content-Type": "application/json", // Define content type
      },
    });

    // Check if the response is not okay (status not 2xx)
    if (!res.ok) throw new Error("Failed to fetch musicians");

    // Parse the response data into JSON
    const data = await res.json();
    const container = document.getElementById("musician-list"); // Get the container for musician cards
    container.innerHTML = ""; // Clear any existing cards

    // Loop through each musician and create a card for display
    Object.values(data).forEach((musician) => {
      const card = document.createElement("div"); // Create a new div for each musician card
      card.className = "musician-card"; // Add class for styling

      // Add content to the card (image, name, genre, email)
      card.innerHTML = `
        <img src="../img/imgage.jpeg" alt="${musician.musician_name}" />
        <div class="musician-info">
          <h3>${musician.musician_name}</h3>
          <p>Genre: ${musician.music_genre}</p>
          <p>Email: ${musician.email}</p>
        </div>
      `;

      // Add a click event listener to the card to view more details
      card.addEventListener("click", () => {
        // Store the selected musician data in localStorage
        localStorage.setItem("selected_musician", JSON.stringify(musician));
        // Redirect to musician detail page
        window.location.href = "musician_detail.html";
      });

      // Append the newly created card to the container
      container.appendChild(card);
    });
  } catch (err) {
    // Log the error to the console and alert the user if the musician data couldn't be loaded
    console.error("Error loading musicians:", err);
    alert("Could not load musicians.");
  }
}

// Search functionality to filter musicians by name
document.getElementById("search-bar").addEventListener("input", function () {
  const query = this.value.toLowerCase(); // Convert the search query to lowercase for case-insensitive comparison
  const cards = document.querySelectorAll(".musician-card"); // Get all musician cards

  // Loop through each card and display it if the name matches the search query
  cards.forEach((card) => {
    const name = card.querySelector("h3").textContent.toLowerCase(); // Get the name from the card
    // Show the card if the name contains the search query, otherwise hide it
    card.style.display = name.includes(query) ? "flex" : "none";
  });
});

// Once the DOM content is loaded, call the loadMusicians function to populate the list
document.addEventListener("DOMContentLoaded", loadMusicians);
