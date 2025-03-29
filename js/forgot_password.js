// Define the base URL for API requests
const BASE_URL = "https://web-music-proj.onrender.com";

// Add an event listener for the form submission to handle password reset
document.getElementById("reset-form").addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent the default form submission

  // Retrieve the username and new password entered by the user
  const username = document.getElementById("username").value.trim();
  const newPassword = document.getElementById("new-password").value.trim();

  // Check if both username and new password are provided
  if (!username || !newPassword) {
    return alert("Both fields are required"); // Alert if any field is missing
  }

  // Define the roles to search for the user (user, musician, admin)
  const roles = ["user", "musician", "admin"];
  let updated = false; // Flag to check if the password update was successful

  // Loop through each role to attempt to update the password
  for (const role of roles) {
    const endpoint = `${BASE_URL}/${role}/update_${role}_info`; // Build the endpoint URL based on the role

    // Prepare the request body with username and the password details
    const body = {
      [role]: username, // Dynamically set the role (user, musician, admin)
      details: {
        field_to_update: "password", // Specify that the field to update is the password
        field_new_value: newPassword // Set the new password value
      }
    };

    try {
      // Make the PUT request to update the password
      const res = await fetch(endpoint, {
        method: "PUT", // HTTP method is PUT to update data
        headers: {
          "Content-Type": "application/json" // Specify the content type as JSON
        },
        body: JSON.stringify(body) // Convert the request body to a JSON string
      });

      // Parse the JSON response
      const result = await res.json();

      // Check if the password update was successful
      if (result.status === "success" || result.message?.includes("updated")) {
        // If successful, display a success message with the role
        document.getElementById("status-message").textContent = `Password updated successfully for ${role}. Redirecting...`;
        updated = true; // Set the flag to true indicating the update was successful

        // Redirect to the login page after 2 seconds
        setTimeout(() => {
          window.location.href = "../html/login.html"; // Redirect after 2 seconds
        }, 2000);

        break; // Break the loop as we found a successful update
      }

    } catch (err) {
      // Log any errors that occur during the password update process
      console.error(`Error updating password for ${role}:`, err);
    }
  }

  // If no update was successful, display an error message
  if (!updated) {
    document.getElementById("status-message").textContent = "Username not found or error occurred.";
  }
});
