// Testimonials Data
const testimonials = [
    { image: "../img/kay.jpeg", opinion: "FEDS is the best music platform! I can find all my favorite songs here!" },
    { image: "../img/nigga.jpeg", opinion: "I love FEDS because it lets me chat with my favorite artists!" },
    { image: "../img/india.jpeg", opinion: "Great sound quality and easy to use!!" },
    { image: "../img/guy.jpeg", opinion: "The best music streaming site hands down!" }
];

let currentTestimonial = 0;

// Function to Update Testimonial Display
function updateTestimonial() {
    document.getElementById("testimonial-img").src = testimonials[currentTestimonial].image;
    document.getElementById("testimonial-text").textContent = testimonials[currentTestimonial].opinion;
}

// Left Arrow - Show Previous Testimonial
document.getElementById("prev").addEventListener("click", () => {
    currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
    updateTestimonial();
});

// Right Arrow - Show Next Testimonial
document.getElementById("next").addEventListener("click", () => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    updateTestimonial();
});

// Initialize the first testimonial
updateTestimonial();

document.addEventListener("DOMContentLoaded", function () {
    const stars = document.querySelectorAll(".star");
    let selectedRating = 0;

    stars.forEach((star, index) => {
        star.addEventListener("click", function () {
            if (selectedRating === index + 1) {
                // If clicked again at the max selection, reset all stars
                stars.forEach(s => s.style.color = "black");
                selectedRating = 0;
            } else {
                // Highlight stars up to the clicked one
                stars.forEach((s, i) => {
                    s.style.color = i <= index ? "yellow" : "black";
                });
                selectedRating = index + 1;
            }
        });
    });
});

