# Online Learning Platform

This project is a web application that was created as a component of an evaluation of web technologies. Course registration, instructor details, event listings, quizzes, and a contact form are among the interactive elements it offers consumers.

Static .html prototype files were used during early development. These have been removed in favor of fully dynamic .ejs views rendered through Express routes

# Project Structure

- `/views` – Contains all `.ejs` template files rendered by the Express.js server.
- `/public` – Holds static assets like CSS and JavaScript files.
- `server.js` – Node.js + Express server logic including routing, form handling, database integration, and email notifications.
- `/data` – SQLite database created dynamically on server run.

# Technologies Used

- **Node.js + Express.js**
- **EJS Templating**
- **SQLite3 Database**
- **AJAX (for course search)**
- **Nodemailer (for registration email confirmation)**
- **HTML5 + CSS3 + JavaScript**

# How to Run

```bash
npm install
node server.js
