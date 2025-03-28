const baseURL = "https://web-music-proj.onrender.com"; 
const token = localStorage.getItem("access_token");
const role = localStorage.getItem("role");

// Redirect if not authenticated
if (!token || !role) {
  alert("Unauthorized. Please login.");
  window.location.href = "../html/login.html";
}

// Role-based links
const accountLink = document.getElementById("account-link");
if (role === "user") accountLink.href = "user_account.html";
else if (role === "musician") accountLink.href = "musician_account.html";
else if (role === "admin") accountLink.href = "admin_account.html";

const artistLink = document.getElementById("artist-link");
if (role === "user") artistLink.href = "user_artist.html";
else if (role === "musician") artistLink.href = "musician_artist.html";
else if (role === "admin") artistLink.href = "admin_artist.html";

const homeLink = document.getElementById("home-link");
if (role === "user") homeLink.href = "user_home.html";
else if (role === "musician") homeLink.href = "musician_home.html";
else if (role === "admin") homeLink.href = "admin_home.html";

// Get selected musician
const selectedMusician = JSON.parse(localStorage.getItem("selected_musician"));
if (!selectedMusician) {
  alert("No musician selected.");
  window.location.href = homeLink.href;
}

// Load musician info
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("artist-name").textContent = selectedMusician.musician_name;
  document.getElementById("artist-genre").textContent = `Genre: ${selectedMusician.music_genre}`;
  document.getElementById("artist-email").textContent = `Email: ${selectedMusician.email}`;
  document.getElementById("artist-pic").src = "../img/imgage.jpeg"; 

  fetchMusicianCatalogue();
});

// Fetch catalogue
async function fetchMusicianCatalogue() {
  try {
    const res = await fetch(`${baseURL}/${role}/get_musician_catalogue`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ musician_name: selectedMusician.musician_name })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    loadSongs(data);
  } catch (err) {
    console.error("Error fetching catalogue:", err);
    alert("Could not load musician catalogue.");
  }
}

// Load songs into DOM
function loadSongs(songDict) {
  const list = document.getElementById("song-list");
  const searchInput = document.getElementById("search-song");
  let songs = Object.entries(songDict).map(([name, link]) => ({ song_name: name, song_link: link }));
  let filteredSongs = songs;

  function render() {
    list.innerHTML = "";
    filteredSongs.forEach(song => {
      const li = document.createElement("li");
      li.textContent = song.song_name;
      li.onclick = () => playSong(song.song_name, song.song_link);
      list.appendChild(li);
    });
  }

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    filteredSongs = songs.filter(s => s.song_name.toLowerCase().includes(query));
    render();
  });

  render();
}

// Play song and show player
function playSong(name, link) {
  document.getElementById("current-song-name").textContent = name;
  const player = document.getElementById("audio-player");
  player.src = link;
  player.style.display = "block";
  document.getElementById("music-player").style.display = "block";
  player.play();
}
