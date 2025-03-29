# FEDS Music Frontend

This is the frontend for the **FEDS Music App**. It's built with plain HTML, CSS, and JavaScript, and connects with the Flask backend API.

## Project Structure

```
frontend/
│
├── css/
│   ├── login.css
│   ├── musician_home.css
│   ├── admin_home.css
│   ├── get_client.css
│   └── ...other styles
│
├── html/
│   ├── login.html
│   ├── musician_home.html
│   ├── admin_home.html
│   ├── forgot_password.html
│   ├── landing_page.html
│   └── ...other pages
│
├── js/
│   ├── login.js
│   ├── musician_home.js
│   ├── get_client.js
│   ├── forgot_password.js
│   └── ...other scripts
│
└── img/
    └── image.webp (static images used in profile and logo)
```

## Features

- Role-based login (User, Musician, Admin)
- Real-time profile updates
- Password reset page (Forgot Password)
- Admin can view and delete any user or musician
- Music upload and update for musicians
- Clean and responsive UI using plain CSS
- Secure routes using JWT stored in `localStorage`

## Setup Instructions

1. Make sure your Flask backend is running (API should be live)
2. Open `html/login.html` or `landing_page.html` in your browser
3. You can also serve the frontend using VS Code Live Server or any static file server

## Important Notes

- The app checks `localStorage` for `access_token` and `role` before allowing access to protected pages.
- If token is missing or invalid, the user is redirected to `login.html`.

## Testing

- Test each role separately (User, Musician, Admin)
- Test upload, update, and delete features for music and clients
- Use the forgot password page to reset password if needed

## Issues We Fixed

- **Role-based redirection wasn't working at first** → Solved by checking `role` in `localStorage`
- **Forgot password kept failing** → Fixed by removing JWT on update routes and adjusting JS logic
- **Get clients was failing** → Added correct object value extraction for user/admin/musician
- **Delete client error (500)** → Solved by retrieving correct passwords before deletion in the backend
