// Define the base URL for the API
const baseURL = "https://web-music-proj.onrender.com"; 

// Event listener that triggers when the DOM content is loaded
document.addEventListener("DOMContentLoaded", async function () {
  // Retrieve the token and role from local storage
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");

  // Check if the token exists and if the role is 'admin'
  if (!token || role !== "admin") {
    // If the user is not an admin, redirect to login page with an alert
    alert("Unauthorized access. Redirecting to login...");
    window.location.href = "../html/login.html";
    return;
  }

  try {
    // Fetch admin profile data from the server
    const res = await fetch(`${baseURL}/admin/admin_profile`, {
      method: "GET", // HTTP GET method to retrieve data
      headers: {
        Authorization: `Bearer ${token}`, // Authorization header with the token
        "Content-Type": "application/json" // Content type as JSON
      }
    });

    // Check if the response was successful
    if (!res.ok) throw new Error("Failed to fetch admin profile");

    // Parse the JSON response
    const admin = await res.json();

    // Display admin details in the UI
    document.getElementById("username-display").textContent = admin.username;
    document.getElementById("username-input").value = admin.username;
    document.getElementById("email-input").value = admin.email;

  } catch (err) {
    // Handle errors during fetch and display an error message
    alert(err.message);
    console.error("Error fetching admin profile:", err);
  }
});

// Function to update a specific field (e.g., username, email) for the admin
async function updateField(field) {
  const token = localStorage.getItem("access_token"); // Retrieve token from local storage
  const newValue = document.getElementById(`${field}-input`).value; // Get the new value from input field

  // If the new value is empty, alert the user
  if (!newValue) return alert("Field cannot be empty");

  // Prepare the request body with field data
  const body = {
    details: {
      field_to_update: field, // Field that needs to be updated
      field_new_value: newValue // New value to set for the field
    }
  };

  try {
    // Send PUT request to update admin info
    const res = await fetch(`${baseURL}/admin/update_admin_info`, {
      method: "PUT", // HTTP PUT method for updating data
      headers: {
        Authorization: `Bearer ${token}`, // Authorization header with the token
        "Content-Type": "application/json" // Content type as JSON
      },
      body: JSON.stringify(body) // Stringify the body object
    });

    // Parse the response to show a success message
    const result = await res.json();
    alert(result.message);

  } catch (err) {
    // Handle any errors during the update process
    console.error("Update failed:", err);
    alert("Failed to update field.");
  }
}

// Logout function to clear local storage and redirect to login page
document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.clear(); // Clear all data from local storage
  alert("Logged out successfully.");
  window.location.href = "../html/login.html"; // Redirect to login page
});

// Delete account function to delete the admin account
document.getElementById("delete-btn").addEventListener("click", async () => {
  // Prompt the user to enter their password before deleting the account
  const password = prompt("Enter your password to delete your admin account:");
  if (!password) return alert("Password is required."); // Ensure password is entered

  const token = localStorage.getItem("access_token"); // Retrieve token from local storage

  try {
    // Send DELETE request to delete the admin account
    const res = await fetch(`${baseURL}/admin/delete_admin_details`, {
      method: "DELETE", // HTTP DELETE method to remove data
      headers: {
        Authorization: `Bearer ${token}`, // Authorization header with the token
        "Content-Type": "application/json" // Content type as JSON
      },
      body: JSON.stringify({ password }) // Send password as part of the body
    });

    // Parse the response and handle success or failure
    const result = await res.json();

    if (res.ok) {
      // If the request is successful, show success message and clear local storage
      alert("Account deleted successfully.");
      localStorage.clear();
      window.location.href = "../html/login.html"; // Redirect to login page
    } else {
      // Show error message if deletion fails
      alert(result.message || "Failed to delete account.");
    }

  } catch (err) {
    // Handle any errors during the delete process
    console.error("Delete error:", err);
    alert("Something went wrong while deleting account.");
  }
});
