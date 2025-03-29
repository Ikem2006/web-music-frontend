// Define the base URL for the API
const API_BASE = "https://web-music-proj.onrender.com";

// Wait for the DOM content to fully load before executing
document.addEventListener("DOMContentLoaded", () => {
  // Get the registration form element
  const form = document.getElementById("registration-form");

  // Auto-fill task ID if it exists in localStorage
  const storedTaskId = localStorage.getItem("feds_task_id");
  if (storedTaskId) {
    // Set the task ID in the appropriate fields for user and musician roles
    document.getElementById("user_task_id").value = storedTaskId;
    document.getElementById("musician_task_id").value = storedTaskId;
  }

  // Event listener for form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();  // Prevent the default form submission behavior

    // Get the selected role from the form input
    const role = document.querySelector("input[name='role']:checked")?.value;
    if (!role) return alert("Please select a role.");  // Alert if no role is selected

    // Get the email and password from the form fields
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Initialize the payload object that will be sent in the POST request
    let payload = { email, password };
    let endpoint = "";  // Initialize the endpoint variable

    // Check the selected role and add the relevant data to the payload
    if (role === "user") {
      payload.name = document.getElementById("user_name").value;
      payload.username = document.getElementById("user_username").value;
      payload.task_id = document.getElementById("user_task_id").value;
      endpoint = "/user/add_user";  // Set endpoint for user registration
    }

    if (role === "musician") {
      payload.username = document.getElementById("musician_username").value;
      payload.music_genre = document.getElementById("music_genre").value;
      payload.task_id = document.getElementById("musician_task_id").value;
      endpoint = "/musician/add_musician";  // Set endpoint for musician registration
    }

    if (role === "admin") {
      payload.username = document.getElementById("admin_username").value;
      endpoint = "/admin/add_admin";  // Set endpoint for admin registration
    }

    try {
      // Make a POST request to the appropriate API endpoint with the payload
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)  // Convert payload object to JSON string
      });

      // Parse the response from the server
      const result = await res.json();

      // If registration is successful, show a success message and redirect to login
      if (result.status === "success") {
        alert("✅ Registration successful! Redirecting to login...");
        localStorage.removeItem("feds_task_id");  // Remove task ID from localStorage
        window.location.href = "../html/login.html";  // Redirect to login page
      } else {
        // Show the error message if registration fails
        alert(`❌ ${result.message || "Registration failed"}`);
      }
    } catch (err) {
      // Handle any errors that occur during the registration process
      console.error("Registration error:", err);
      alert("Something went wrong.");
    }
  });
});

// Function to show specific fields based on the selected role
function showFields(role) {
  // Hide all role-related fields
  document.querySelectorAll(".role-fields").forEach(div => div.style.display = "none");

  // Show the fields related to the selected role
  document.getElementById(`${role}-fields`).style.display = "block";
}
