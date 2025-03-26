const API_BASE = "https://web-music-proj.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registration-form");

  // Auto-fill task ID from localStorage
  const storedTaskId = localStorage.getItem("feds_task_id");
  if (storedTaskId) {
    document.getElementById("user_task_id").value = storedTaskId;
    document.getElementById("musician_task_id").value = storedTaskId;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const role = document.querySelector("input[name='role']:checked")?.value;
    if (!role) {
      alert("Please select a role.");
      return;
    }

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    let payload = {};
    let endpoint = "";

    if (role === "user") {
      payload = {
        name,
        username: document.getElementById("user_username").value,
        email,
        password,
        task_id: document.getElementById("user_task_id").value
      };
      endpoint = "/user/add_user";
    }

    if (role === "musician") {
      payload = {
        username: document.getElementById("musician_username").value,
        music_genre: document.getElementById("music_genre").value,
        email,
        password,
        task_id: document.getElementById("musician_task_id").value
      };
      endpoint = "/musician/add_musician";
    }

    if (role === "admin") {
      payload = {
        username: document.getElementById("admin_username").value,
        email,
        password
      };
      endpoint = "/admin/add_admin";
    }

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (result.status === "success") {
        alert("✅ Registration successful! Redirecting to login page...");
        localStorage.removeItem("feds_task_id");
        window.location.href = "login.html";
      } else {
        alert(`❌ ${result.message || "Registration failed"}`);
      }
    } catch (err) {
      console.error("Registration error:", err);
      alert("Something went wrong.");
    }
  });
});

function showFields(role) {
  document.querySelectorAll(".role-fields").forEach(div => div.style.display = "none");
  document.getElementById(`${role}-fields`).style.display = "block";
}
