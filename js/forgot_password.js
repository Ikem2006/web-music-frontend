const BASE_URL = "https://web-music-proj.onrender.com";

document.getElementById("reset-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const newPassword = document.getElementById("new-password").value.trim();

  if (!username || !newPassword) {
    return alert("Both fields are required");
  }

  const roles = ["user", "musician", "admin"];
  let updated = false;

  for (const role of roles) {
    const endpoint = `${BASE_URL}/${role}/update_${role}_info`;

    const body = {
      [role]: username,
      details: {
        field_to_update: "password",
        field_new_value: newPassword
      }
    };

    try {
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      const result = await res.json();

      if (result.status === "success" || result.message?.includes("updated")) {
        document.getElementById("status-message").textContent = `Password updated successfully for ${role}. Redirecting...`;
        updated = true;

        // Redirect after 2 seconds
        setTimeout(() => {
          window.location.href = "../html/login.html";
        }, 2000);

        break;
      }

    } catch (err) {
      console.error(`Error updating password for ${role}:`, err);
    }
  }

  if (!updated) {
    document.getElementById("status-message").textContent = "Username not found or error occurred.";
  }
});
