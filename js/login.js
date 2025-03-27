const BASE_URL = "https://web-music-proj.onrender.com";

document.getElementById("login-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const endpoints = {
    user: `${BASE_URL}/user/authenticate_user`,
    musician: `${BASE_URL}/musician/authenticate_musician`,
    admin: `${BASE_URL}/admin/authenticate_admin`,
  };

  let found = false;

  for (const [role, endpoint] of Object.entries(endpoints)) {
    try {
      const body =
        role === "musician"
          ? { music_name: username, password }
          : { username, password };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (result.status === "success") {
        console.log(`Logged in as ${role}`);
        localStorage.setItem("access_token", result.access_token);
        localStorage.setItem("role", role);
        localStorage.setItem("username", username);

        // Join appropriate room
        await fetch(`${BASE_URL}/${role}/join_${role}_room`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${result.access_token}`,
            "Content-Type": "application/json",
          },
        });

        window.location.href = "home.html";
        found = true;
        break;
      }
    } catch (err) {
      console.error(`${role} login failed:`, err);
    }
  }

  if (!found) {
    alert("Login failed. Invalid credentials or server error.");
  }
});
