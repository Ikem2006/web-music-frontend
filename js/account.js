// Function to Enable Editing of Fields
function editField(fieldId) {
    const field = document.getElementById(fieldId);
    field.disabled = false;
    field.focus();
}

// Handle Profile Picture Upload
document.getElementById("upload-pic").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById("profile-pic").src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Save Changes Button (For Future Database Integration)
document.getElementById("save-btn").addEventListener("click", function() {
    alert("Changes Saved!");
});
