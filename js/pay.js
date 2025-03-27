// ✅ Global API base URL
const API_BASE = "https://web-music-proj.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
  const paymentForm = document.getElementById("payment-form");

  paymentForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const task_id = crypto.randomUUID(); 

    const formData = {
      account_name: document.getElementById("account_name").value,
      account_number: document.getElementById("account_number").value,
      cvv: document.getElementById("cvv").value,
      password: document.getElementById("password").value,
      amount_in_account: parseFloat(document.getElementById("amount_in_account").value),
      user_expiry_date: document.getElementById("user_expiry_date").value,
      task_id: task_id
    };

    try {
      const response = await fetch(`${API_BASE}/musician/payment_processed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.status === "success") {
        alert(`✅ Payment successful!\n\n💡 Your Task ID is:\n${task_id}\n\n📋 Please copy this ID. You’ll be redirected to registration.`);

        // ✅ Store task ID in localStorage so register.js can access it
        localStorage.setItem("feds_task_id", task_id);

        // ✅ Redirect to register.html
        window.location.href = "html/register.html";
      } else {
        alert(`❌ Error: ${result.message}`);
      }

    } catch (error) {
      console.error("Payment failed", error);
      alert("Something went wrong. Please try again.");
    }
  });
});
