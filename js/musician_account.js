const BASE_URL = "https://web-music-proj.onrender.com";
let musicianName = "";

document.addEventListener("DOMContentLoaded", async function () {
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");

  if (!token || role !== "musician") {
    alert("Unauthorized access. Redirecting to login...");
    window.location.href = "../html/login.html";
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/musician/musician_profile`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    const musician = await res.json();
    musicianName = musician.musician_name;

    document.getElementById("artist-name-display").textContent = musicianName;
    document.getElementById("artist-name-input").value = musicianName;
    document.getElementById("email-input").value = musician.email;
    document.getElementById("genre-input").value = musician.music_genre;
    document.getElementById("catalogue-title").textContent = `${musicianName}'s Catalogue`;

    loadMusicList(musician.music || []);
  } catch (err) {
    alert(err.message);
  }
});

function loadMusicList(musicArray) {
  const listContainer = document.getElementById("music-list");
  listContainer.innerHTML = "<h4>Your Songs</h4>";

  musicArray.forEach((song, index) => {
    const row = document.createElement("div");
    row.className = "song-row";

    row.innerHTML = `
      <div class="song-controls">
        <a href="${song.song_link}" target="_blank">${song.song_name}</a>
        <input type="file" class="song-file-input" id="file-${index}" />
        <button class="edit-btn" onclick="updateSong('${song.song_name}', 'file-${index}')">✏️</button>
        <button class="edit-btn" onclick="deleteSong('${song.song_name}')">🗑️</button>
      </div>
    `;
    listContainer.appendChild(row);
  });
}

async function updateField(field) {
  const token = localStorage.getItem("access_token");
  const inputId = field === 'musician_name' ? "artist-name-input" : `${field}-input`;
  const newValue = document.getElementById(inputId).value;
  if (!newValue) return alert("Field cannot be empty");

  const body = {
    details: {
      field_to_update: field,
      field_new_value: newValue
    }
  };

  try {
    const res = await fetch(`${BASE_URL}/musician/update_musician_info`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    const result = await res.json();
    alert(result.message);
    window.location.reload();
  } catch (err) {
    alert("Failed to update musician detail");
  }
}

async function uploadMusic() {
  const token = localStorage.getItem("access_token");
  const fileInput = document.getElementById("music-file");
  const file = fileInput.files[0];

  if (!file) return alert("Please choose a music file.");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("song_name", file.name);

  try {
    const res = await fetch(`${BASE_URL}/musician/add_music`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` },
      body: formData
    });
    const result = await res.json();
    alert(result.message);
    window.location.reload();
  } catch (err) {
    alert("Failed to upload music");
  }
}

async function updateSong(songName, inputId) {
  const token = localStorage.getItem("access_token");
  const fileInput = document.getElementById(inputId);
  const file = fileInput.files[0];

  if (!file) return alert("Choose a new file to update");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("song_name", songName);

  try {
    const res = await fetch(`${BASE_URL}/musician/update_music`, {
      method: "PUT",
      headers: { "Authorization": `Bearer ${token}` },
      body: formData
    });
    const result = await res.json();
    alert(result.message);
    window.location.reload();
  } catch (err) {
    alert("Failed to update song");
  }
}

async function deleteSong(songName) {
  const token = localStorage.getItem("access_token");
  const password = prompt("Enter your password to delete this song:");
  if (!password) return;

  const body = JSON.stringify({ password, song_name: songName });

  try {
    const res = await fetch(`${BASE_URL}/musician/delete_music`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body
    });

    const result = await res.json();
    alert(result.message);
    window.location.reload();
  } catch (err) {
    alert("Failed to delete song");
  }
}

function logout() {
  localStorage.clear();
  window.location.href = "../html/login.html";
}

async function deleteAccount() {
  const token = localStorage.getItem("access_token");
  const password = prompt("Enter your password to delete your account:");
  if (!password) return;

  try {
    const res = await fetch(`${BASE_URL}/musician/delete_musician_details`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ password })
    });

    const result = await res.json();
    alert(result.message);

    if (result.status === "success") {
      localStorage.clear();
      window.location.href = "../html/login.html";
    }
  } catch (err) {
    alert("Failed to delete account");
  }
}
