// Define the base URL for the backend API
const BASE_URL = "https://web-music-proj.onrender.com";

// Add an event listener to the login form for the 'submit' event
document.getElementById("login-form").addEventListener("submit", async function (e) {
  e.preventDefault(); // Prevent the default form submission behavior

  // Get the username and password input values, trimming any leading or trailing spaces
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  // Define the different authentication endpoints for each role
  const endpoints = {
    user: `${BASE_URL}/user/authenticate_user`,
    musician: `${BASE_URL}/musician/authenticate_musician`,
    admin: `${BASE_URL}/admin/authenticate_admin`,
  };

  // Loop through each role and check credentials
  for (const [role, endpoint] of Object.entries(endpoints)) {
    try {
      // Prepare the request body based on the role (user vs musician)
      const body = role === "musician" ? { music_name: username, password } : { username, password };
      
      // Send a POST request to the corresponding endpoint
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // Set the content type to JSON
        body: JSON.stringify(body), // Convert the body to JSON format
      });

      // Parse the JSON response from the server
      const result = await response.json();

      // Check if the login is successful
      if (result.status === "success") {
        // Store the access token and user role in localStorage
        localStorage.setItem("access_token", result.access_token);
        localStorage.setItem("role", role);

        // Define the redirects for each role
        const redirects = {
          user: "user_home.html",      // Redirect to user home page
          musician: "musician_home.html", // Redirect to musician home page
          admin: "admin_home.html",    // Redirect to admin home page
        };

        // Redirect the user to the appropriate page based on their role
        window.location.href = redirects[role];
        return; // Stop further execution if login is successful
      }
    } catch (err) {
      console.error(`${role} login failed:`, err); // Log any errors during the login attempt
    }
  }

  // If none of the login attempts were successful, show an error message
  document.getElementById("login-status").textContent = "Login failed. Invalid credentials or server error.";
});
