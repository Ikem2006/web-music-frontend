const BASE_URL = "https://web-music-proj.onrender.com";
  
let musicianName = "";

// Load profile data
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

    if (!res.ok) throw new Error("Failed to fetch musician profile");
    const musician = await res.json();
    musicianName = musician.musician_name;

    document.getElementById("artist-name-display").textContent = musician.musician_name;
    document.getElementById("artist-name-input").value = musician.musician_name;
    document.getElementById("email-input").value = musician.email;
    document.getElementById("genre-input").value = musician.music_genre;
    document.getElementById("catalogue-title").textContent = `${musician.musician_name}'s Catalogue`;

    loadMusicList(musician.music || []);
  } catch (err) {
    alert(err.message);
  }
});

function loadMusicList(musicArray) {
  const listContainer = document.getElementById("music-list");
  listContainer.innerHTML = "<h4>Your Songs</h4>";

  musicArray.forEach((song, index) => {
    const songRow = document.createElement("div");
    songRow.className = "song-row";
    songRow.innerHTML = `
      <a href="${song.song_link}" target="_blank">${song.song_name}</a>
      <button class="edit-btn" onclick="updateSong('${song.song_name}')">✏️</button>
    `;
    listContainer.appendChild(songRow);
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
        headers: {
          "Authorization": `Bearer ${token}`
        },
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
  
    if (!file) return alert("Please choose a new song file.");
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("song_name", songName);
  
    try {
      const res = await fetch(`${BASE_URL}/musician/update_music`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });
  
      const result = await res.json();
      alert(result.message);
      window.location.reload();
    } catch (err) {
      alert("Failed to update song");
    }
  }