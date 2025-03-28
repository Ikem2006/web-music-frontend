document.addEventListener("DOMContentLoaded", async function () {
    const BASE_URL = "https://web-music-proj.onrender.com";
  
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");

 
    if (!token || role !== "user") {
      alert("Unauthorized access. Redirecting to login...");
      window.location.href = "../html/login.html";
      return;
    }
  
    try {
      const res = await fetch(`${BASE_URL}/user/user_profile`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (!res.ok) throw new Error("Failed to fetch user profile");
      const user = await res.json();
  
      document.getElementById("username-display").textContent = user.username;
      document.getElementById("username-input").value = user.username;
      document.getElementById("name-input").value = user.name;
      document.getElementById("email-input").value = user.email;
  
    } catch (err) {
      alert(err.message);
    }
  });
  
  async function updateField(field) {
    const BASE_URL = "https://web-music-proj.onrender.com";
     
  
    const token = localStorage.getItem("access_token");
    const inputId = `${field}-input`;
    const newValue = document.getElementById(inputId).value;
    if (!newValue) return alert("Field cannot be empty");
  
    const body = {
      details: {
        field_to_update: field,
        field_new_value: newValue
      }
    };
  
    try {
      const res = await fetch(`${BASE_URL}/user/update_user_info`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });
  
      const result = await res.json();
      alert(result.message);
    } catch (err) {
      alert("Failed to update user detail");
    }
  }
  
  // Logout logic
document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.clear();
  alert("You have been logged out.");
  window.location.href = "../html/login.html";
});

// Delete logic
document.getElementById("delete-btn").addEventListener("click", async () => {
  const BASE_URL = "https://web-music-proj.onrender.com";
  const token = localStorage.getItem("access_token");
  const password = prompt("Enter your password to delete your account:");

  if (!password) {
    return alert("Password is required to delete your account.");
  }

  try {
    const response = await fetch(`${BASE_URL}/user/delete_user_details`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Account deleted successfully.");
      localStorage.clear();
      window.location.href = "../html/login.html";
    } else {
      alert(result.message || "Failed to delete account.");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong while deleting account.");
  }
});
