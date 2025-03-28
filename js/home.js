const testimonials = [
    { image: "../img/kay.jpeg", opinion: "FEDS is the best music platform! I can find all my favorite songs here!" },
    { image: "../img/nigga.jpeg", opinion: "I love FEDS because it lets me chat with my favorite artists!" },
    { image: "../img/india.jpeg", opinion: "Great sound quality and easy to use!!" },
    { image: "../img/guy.jpeg", opinion: "The best music streaming site hands down!" }
];

let currentTestimonial = 0;

function updateTestimonial() {
    document.getElementById("testimonial-img").src = testimonials[currentTestimonial].image;
    document.getElementById("testimonial-text").textContent = testimonials[currentTestimonial].opinion;
}

document.getElementById("prev").addEventListener("click", () => {
    currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
    updateTestimonial();
});

document.getElementById("next").addEventListener("click", () => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    updateTestimonial();
});

document.addEventListener("DOMContentLoaded", function () {
    updateTestimonial();

    const stars = document.querySelectorAll(".star");
    let selectedRating = 0;

    stars.forEach((star, index) => {
        star.addEventListener("click", function () {
            if (selectedRating === index + 1) {
                stars.forEach(s => s.style.color = "white");
                selectedRating = 0;
                document.getElementById("rating-result").textContent = "";
            } else {
                stars.forEach((s, i) => {
                    s.style.color = i <= index ? "gold" : "white";
                });
                selectedRating = index + 1;
                document.getElementById("rating-result").textContent = `Thank you! You rated us ${selectedRating} star(s).`;
            }
        });
    });

    const role = localStorage.getItem("role");
    const token = localStorage.getItem("access_token");

    if (role) {
        const accountLink = document.getElementById("account-link");
        accountLink.href = `${role}_account.html`;
    }

    document.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", (e) => {
            if (token && link.href && !link.href.includes("#")) {
                fetch(link.href, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            }
        });
    });
});