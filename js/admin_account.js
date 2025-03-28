const baseURL = "https://web-music-proj.onrender.com"; 

document.addEventListener("DOMContentLoaded", async function () {
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");

 
  if (!token || role !== "admin") {
    alert("Unauthorized access. Redirecting to login...");
    window.location.href = "../html/login.html";
    return;
  }

  try {
    const res = await fetch(`${baseURL}/admin/admin_profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) throw new Error("Failed to fetch admin profile");

    const admin = await res.json();

    document.getElementById("username-display").textContent = admin.username;
    document.getElementById("username-input").value = admin.username;
    document.getElementById("email-input").value = admin.email;

  } catch (err) {
    alert(err.message);
    console.error("Error fetching admin profile:", err);
  }
});

async function updateField(field) {
  const token = localStorage.getItem("access_token");
  const newValue = document.getElementById(`${field}-input`).value;

  if (!newValue) return alert("Field cannot be empty");

  const body = {
    details: {
      field_to_update: field,
      field_new_value: newValue
    }
  };

  try {
    const res = await fetch(`${baseURL}/admin/update_admin_info`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const result = await res.json();
    alert(result.message);
  } catch (err) {
    console.error("Update failed:", err);
    alert("Failed to update field.");
  }
}

  