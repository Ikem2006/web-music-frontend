// Define the base URL for API requests
const BASE_URL = "https://web-music-proj.onrender.com";

// Wait for the DOM to be fully loaded before running the script
document.addEventListener("DOMContentLoaded", async () => {
  // Retrieve the access token and role from local storage
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");

  // Check if the user is an admin and has a valid token
  if (!token || role !== "admin") {
    // If the user is not an admin or token is missing, redirect to login
    alert("Unauthorized access. Redirecting to login...");
    window.location.href = "../html/login.html"; // Redirect to login page
    return; // Exit the function
  }

  // Get references to HTML elements for displaying client data and search input
  const container = document.getElementById("clients-container");
  const searchInput = document.getElementById("search-input");
  const currentAdmin = localStorage.getItem("username"); // Store current admin username
  let allClients = []; // Array to hold all clients data

  try {
    // Fetch data for users, musicians, and admins concurrently
    const [usersRes, musiciansRes, adminsRes] = await Promise.all([
      fetch(`${BASE_URL}/admin/get_users`, {
        headers: { Authorization: `Bearer ${token}` }, // Include token for authorization
      }),
      fetch(`${BASE_URL}/admin/get_musicians`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${BASE_URL}/admin/get_all_admin`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    // Parse the responses as JSON
    const usersData = await usersRes.json();
    const musiciansData = await musiciansRes.json();
    const adminsData = await adminsRes.json();

    // Process the user data, adding name and role properties
    const users = Object.values(usersData || {}).map((u) => ({
      ...u,
      name: u.username || u.name || "Unnamed", // Default to "Unnamed" if no name exists
      role: "user", // Set role as "user"
    }));

    // Process the musician data, adding name and role properties
    const musicians = Object.values(musiciansData || {}).map((m) => ({
      ...m,
      name: m.musician_name || "Unnamed",
      role: "musician", // Set role as "musician"
    }));

    // Process the admin data, adding name and role properties
    const admins = Object.values(adminsData || {}).map((a) => ({
      ...a,
      name: a.username || a.name || "Unnamed",
      role: "admin", // Set role as "admin"
    }));

    // Combine all clients (users, musicians, and admins)
    allClients = [...users, ...musicians, ...admins];

    // Render the list of all clients
    renderClients(allClients);

    // Set up an event listener to filter clients based on the search input
    searchInput.addEventListener("input", () => {
      const term = searchInput.value.toLowerCase(); // Convert search term to lowercase
      const filtered = allClients.filter((c) =>
        c.name.toLowerCase().includes(term) // Filter clients by name
      );
      renderClients(filtered); // Render the filtered list
    });
  } catch (err) {
    // If there's an error loading client data, show an alert and log the error
    alert("Failed to load clients.");
    console.error("Client loading error:", err);
  }

  // Function to render the client list into the container
  function renderClients(clients) {
    container.innerHTML = ""; // Clear the container before rendering
    if (clients.length === 0) {
      container.innerHTML = "<p>No clients found.</p>"; // If no clients, show a message
      return;
    }

    // Loop through each client and create a card to display their details
    clients.forEach((client) => {
      const card = document.createElement("div");
      card.className = "client-card"; // Assign a class for styling
      card.innerHTML = `
        <img src="../img/imgage.jpeg" alt="${client.name}"> <!-- Placeholder image -->
        <h3>${client.name}</h3>
        <p>${client.role}</p>
        ${
          // Only show delete button if the client is not the current admin
          client.role !== "admin" || client.name !== currentAdmin
            ? `<button class="delete-btn" onclick="deleteClient('${client.role}', '${client.name}')">🗑️</button>`
            : ""
        }
      `;
      container.appendChild(card); // Append the client card to the container
    });
  }
});

// Function to handle deleting a client
async function deleteClient(role, username) {
  const password = prompt(`Enter your password to delete ${username}`); // Prompt for admin password
  if (!password) return; // If no password is provided, exit the function

  // Retrieve the authorization token
  const token = localStorage.getItem("access_token");

  // Define the appropriate API endpoint based on the client role
  const routes = {
    user: "delete_user_details",
    musician: "delete_musician_details",
    admin: "delete_admin_details",
  };

  // Prepare the request body with the password and username to delete
  const body = {
    password,
    user_to_delete: username,
  };

  try {
    // Make a DELETE request to the API to delete the client
    const res = await fetch(`${BASE_URL}/admin/${routes[role]}`, {
      method: "DELETE", // Use DELETE method for removing data
      headers: {
        Authorization: `Bearer ${token}`, // Include the token for authorization
        "Content-Type": "application/json", // Specify content type
      },
      body: JSON.stringify(body), // Send the body as JSON
    });

    // Parse the response from the server
    const result = await res.json();

    // Display the result message
    alert(result.message);

    // Reload the page to reflect the changes
    location.reload();
  } catch (err) {
    // If an error occurs, display an error message and log the error
    alert("Failed to delete client.");
    console.error(err);
  }
}
