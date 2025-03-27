// Function to Enable Editing of Fields
function editField(fieldId) {
    const field = document.getElementById(fieldId);
    field.disabled = false;
    field.focus();
}

// Handle Profile Picture Upload
document.getElementById("upload-artist-pic").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById("artist-pic").src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Save Changes Button
document.getElementById("save-artist-btn").addEventListener("click", function() {
    alert("Changes Saved!");
});

// Handle Music Catalogue
document.getElementById("add-song-btn").addEventListener("click", function() {
    const songName = document.getElementById("song-name").value;
    if (songName) {
        const li = document.createElement("li");
        li.innerHTML = `${songName} <button onclick="this.parentElement.remove()">❌</button>`;
        document.getElementById("song-list").appendChild(li);
        document.getElementById("song-name").value = "";
    } else {
        alert("Please enter a song name.");
    }
});
