// ✅ Global API base URL
const baseURL = "https://web-music-proj.onrender.com"; 
// Get the access token and user role from localStorage
const token = localStorage.getItem("access_token");
const role = localStorage.getItem("role");

// Redirect to login if not authenticated
if (!token || !role) {
  alert("Unauthorized. Please login.");
  window.location.href = "../html/login.html";  // Redirect to login page
}

// Role-based links for account, artist, and home pages
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

// Get selected musician from localStorage
const selectedMusician = JSON.parse(localStorage.getItem("selected_musician"));
if (!selectedMusician) {
  alert("No musician selected.");
  window.location.href = homeLink.href;  // Redirect to the appropriate home page
}

// Load selected musician's information
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("artist-name").textContent = selectedMusician.musician_name;
  document.getElementById("artist-genre").textContent = `Genre: ${selectedMusician.music_genre}`;
  document.getElementById("artist-email").textContent = `Email: ${selectedMusician.email}`;
  document.getElementById("artist-pic").src = "../img/imgage.jpeg";  // Default image for artist

  // Fetch musician's catalog of songs
  fetchMusicianCatalogue();
});

// Fetch musician's song catalogue from the API
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

    // If the request is successful, load songs into the UI
    loadSongs(data);
  } catch (err) {
    console.error("Error fetching catalogue:", err);
    alert("Could not load musician catalogue.");  // Show error message if catalogue fetch fails
  }
}

// Load songs into the DOM and filter by search query
function loadSongs(songDict) {
  const list = document.getElementById("song-list");  // Get the list element to display songs
  const searchInput = document.getElementById("search-song");  // Search bar for song filtering
  let songs = Object.entries(songDict).map(([name, link]) => ({ song_name: name, song_link: link }));
  let filteredSongs = songs;  // Initially, all songs are visible

  function render() {
    list.innerHTML = "";  // Clear current list
    filteredSongs.forEach(song => {
      const li = document.createElement("li");
      li.textContent = song.song_name;
      li.onclick = () => playSong(song.song_name, song.song_link);  // Set click event to play song
      list.appendChild(li);  // Add the song to the list
    });
  }

  // Add search functionality: filter songs based on user input
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();  // Convert search input to lowercase
    filteredSongs = songs.filter(s => s.song_name.toLowerCase().includes(query));  // Filter songs by name
    render();  // Re-render the filtered list
  });

  render();  // Initial rendering of all songs
}

// Function to play a song when clicked
function playSong(name, link) {
  document.getElementById("current-song-name").textContent = name;  // Show song name
  const player = document.getElementById("audio-player");
  player.src = link;  // Set the audio player source to the selected song's link
  player.style.display = "block";  // Show the audio player
  document.getElementById("music-player").style.display = "block";  // Show the music player container
  player.play();  // Start playing the song
}
