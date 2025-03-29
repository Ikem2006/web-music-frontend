// Array of testimonials with images and opinions
const testimonials = [
    { image: "../img/kay.jpeg", opinion: "FEDS is the best music platform! I can find all my favorite songs here!" },
    { image: "../img/nigga.jpeg", opinion: "I love FEDS because it lets me chat with my favorite artists!" },
    { image: "../img/india.jpeg", opinion: "Great sound quality and easy to use!!" },
    { image: "../img/guy.jpeg", opinion: "The best music streaming site hands down!" }
];

// Keep track of the current testimonial
let currentTestimonial = 0;

// Function to update the testimonial image and text on the page
function updateTestimonial() {
    document.getElementById("testimonial-img").src = testimonials[currentTestimonial].image; // Update image
    document.getElementById("testimonial-text").textContent = testimonials[currentTestimonial].opinion; // Update text
}

// Event listener for the "previous" button to navigate backward through testimonials
document.getElementById("prev").addEventListener("click", () => {
    currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length; // Loop around to the last testimonial
    updateTestimonial(); // Update the displayed testimonial
});

// Event listener for the "next" button to navigate forward through testimonials
document.getElementById("next").addEventListener("click", () => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length; // Loop back to the first testimonial
    updateTestimonial(); // Update the displayed testimonial
});

// Wait for the DOM to be fully loaded before executing the rest of the script
document.addEventListener("DOMContentLoaded", function () {
    updateTestimonial(); // Initial update of testimonial on page load

    // Handle the star rating system
    const stars = document.querySelectorAll(".star"); // Select all star elements
    let selectedRating = 0; // Track the selected rating (1 to 5 stars)

    stars.forEach((star, index) => {
        // Set up a click event listener for each star
        star.addEventListener("click", function () {
            // If the user clicks on the same star again, reset the rating
            if (selectedRating === index + 1) {
                stars.forEach(s => s.style.color = "white"); // Reset all stars to white
                selectedRating = 0; // Clear the selected rating
                document.getElementById("rating-result").textContent = ""; // Clear rating result message
            } else {
                // Set the color of the stars based on the selected rating
                stars.forEach((s, i) => {
                    s.style.color = i <= index ? "gold" : "white"; // Color the stars gold up to the selected one
                });
                selectedRating = index + 1; // Update the selected rating
                document.getElementById("rating-result").textContent = `Thank you! You rated us ${selectedRating} star(s).`; // Display the rating result
            }
        });
    });

    // Check if the role is available in localStorage
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("access_token");

    // If a role is present, set the account link to the appropriate page based on the role
    if (role) {
        const accountLink = document.getElementById("account-link");
        accountLink.href = `${role}_account.html`; // Redirect to the specific account page (user, musician, admin)
    }

    // Add event listeners to all anchor links for tracking and authorization
    document.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", (e) => {
            // If the token exists and the link is not a hash or already visited
            if (token && link.href && !link.href.includes("#")) {
                fetch(link.href, {
                    method: 'GET', // Make a GET request
                    headers: {
                        'Authorization': `Bearer ${token}` // Include the token for authentication
                    }
                });
            }
        });
    });
});
