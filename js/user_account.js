// Wait until the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", async function () {
  const BASE_URL = "https://web-music-proj.onrender.com";
  
  // Get the authentication token and user role from localStorage
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");

  // If the user is not authenticated or the role is not "user", redirect to the login page
  if (!token || role !== "user") {
    alert("Unauthorized access. Redirecting to login...");
    window.location.href = "../html/login.html"; // Redirect to login page
    return;
  }

  // Fetch user profile data from the server
  try {
    const res = await fetch(`${BASE_URL}/user/user_profile`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`, // Pass the token for authentication
        "Content-Type": "application/json"  // Specify that we are sending/receiving JSON
      }
    });

    // If the response is not successful, throw an error
    if (!res.ok) throw new Error("Failed to fetch user profile");

    // Parse the user data and display it in the input fields
    const user = await res.json();
    document.getElementById("username-display").textContent = user.username;
    document.getElementById("username-input").value = user.username;
    document.getElementById("name-input").value = user.name;
    document.getElementById("email-input").value = user.email;

  } catch (err) {
    // Display any error that occurs during the fetch process
    alert(err.message);
  }
});

// Function to update user profile fields
async function updateField(field) {
  const BASE_URL = "https://web-music-proj.onrender.com";

  // Get the authentication token and the new value for the field to be updated
  const token = localStorage.getItem("access_token");
  const inputId = `${field}-input`;  // Create input field ID based on the field name
  const newValue = document.getElementById(inputId).value;

  // If the input field is empty, alert the user
  if (!newValue) return alert("Field cannot be empty");

  // Prepare the request body with the updated field data
  const body = {
    details: {
      field_to_update: field,
      field_new_value: newValue
    }
  };

  try {
    // Send the PUT request to update the user info
    const res = await fetch(`${BASE_URL}/user/update_user_info`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`, // Pass the token for authentication
        "Content-Type": "application/json"  // Specify that we are sending JSON data
      },
      body: JSON.stringify(body)  // Convert the body to a JSON string
    });

    // Parse and display the result of the update operation
    const result = await res.json();
    alert(result.message);  // Alert the user about the success or failure of the update
  } catch (err) {
    // Handle any errors that occur during the update
    alert("Failed to update user detail");
  }
}

// Logout logic
document.getElementById("logout-btn").addEventListener("click", () => {
  // Clear the local storage to log out the user
  localStorage.clear();
  alert("You have been logged out.");  // Inform the user about successful logout
  window.location.href = "../html/login.html";  // Redirect to the login page
});

// Delete account logic
document.getElementById("delete-btn").addEventListener("click", async () => {
  const BASE_URL = "https://web-music-proj.onrender.com";
  const token = localStorage.getItem("access_token");
  const password = prompt("Enter your password to delete your account:");  // Prompt the user for their password

  // If no password is provided, alert the user
  if (!password) {
    return alert("Password is required to delete your account.");
  }

  try {
    // Send a DELETE request to delete the user's account
    const response = await fetch(`${BASE_URL}/user/delete_user_details`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`, // Pass the token for authentication
        "Content-Type": "application/json",  // Specify that we are sending JSON data
      },
      body: JSON.stringify({ password })  // Send the password in the request body
    });

    // Parse the result from the server
    const result = await response.json();

    // If the account deletion was successful, clear the local storage and redirect to login
    if (response.ok) {
      alert("Account deleted successfully.");
      localStorage.clear();  // Clear local storage
      window.location.href = "../html/login.html";  // Redirect to the login page
    } else {
      // If there was an issue with account deletion, alert the user
      alert(result.message || "Failed to delete account.");
    }
  } catch (err) {
    // Handle any errors that occur during account deletion
    console.error(err);
    alert("Something went wrong while deleting account.");
  }
});
