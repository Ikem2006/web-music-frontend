const BASE_URL = "https://web-music-proj.onrender.com";
const SOCKET_URL = BASE_URL; 

document.getElementById("login-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const endpoints = {
    user: `${BASE_URL}/user/authenticate_user`,
    musician: `${BASE_URL}/musician/authenticate_musician`,
    admin: `${BASE_URL}/admin/authenticate_admin`,
  };

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
        // Save session details
        localStorage.setItem("access_token", result.access_token);
        localStorage.setItem("role", role);
        localStorage.setItem("username", username);

        // Check if room was already joined to prevent double room creation
        const joinedRooms = JSON.parse(localStorage.getItem("joined_rooms") || "{}");

        if (!joinedRooms[username]) {
          const socket = io(SOCKET_URL);

          socket.emit("join_room", {
            id: username,
            role: role,
          });

          // Mark this room as joined so it won't trigger again
          joinedRooms[username] = true;
          localStorage.setItem("joined_rooms", JSON.stringify(joinedRooms));
        }

        const redirects = {
          user: "user_home.html",
          musician: "musician_home.html",
          admin: "admin_home.html",
        };

        window.location.href = redirects[role];
        return;
      }
    } catch (err) {
      console.error(`${role} login failed:`, err);
    }
  }

  alert("Login failed. Invalid credentials or server error.");
});
