document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chat-box");
    const chatInput = document.getElementById("chat-message");
    const sendButton = document.getElementById("send-btn");

    // Send message function
    function sendMessage() {
        const messageText = chatInput.value.trim();
        if (messageText === "") return;

        // Create user message
        const userMessage = document.createElement("div");
        userMessage.classList.add("message", "user-message");
        userMessage.innerHTML = `<p><strong>You:</strong> ${messageText}</p>`;
        chatBox.appendChild(userMessage);

        // Scroll to bottom
        chatBox.scrollTop = chatBox.scrollHeight;

        // Clear input
        chatInput.value = "";

        // Simulate artist reply
        setTimeout(() => {
            const artistReply = document.createElement("div");
            artistReply.classList.add("message", "artist-message");
            artistReply.innerHTML = `<p><strong>Artist:</strong> Thanks for your message!</p>`;
            chatBox.appendChild(artistReply);
            chatBox.scrollTop = chatBox.scrollHeight;
        }, 1000);
    }

    // Send message on button click
    sendButton.addEventListener("click", sendMessage);

    // Send message on Enter key press
    chatInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });
});
