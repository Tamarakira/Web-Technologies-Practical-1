const nodemailer = require('nodemailer');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const app = express();
const port = 5000;

const dbFolder = path.join(__dirname, 'data');
if (!fs.existsSync(dbFolder)) {
  fs.mkdirSync(dbFolder);
}

const db = new sqlite3.Database(path.join(dbFolder, 'database.sqlite'), (err) => {
  if (err) {
    console.error('❌ Database error:', err.message);
  } else {
    console.log('✅ Connected to SQLite database.');
  }
});

db.run(`
  CREATE TABLE IF NOT EXISTS contact (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL
  )
`);
db.run(`
  CREATE TABLE IF NOT EXISTS registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    event TEXT NOT NULL
  )
`);
db.run(`
  CREATE TABLE IF NOT EXISTS course_registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    course TEXT NOT NULL
  )
`);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',       
    pass: 'your-app-password'          
  }
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => res.render('home'));
app.get('/courses', (req, res) => res.render('courses'));
app.get('/instructors', (req, res) => res.render('instructors'));
app.get('/events', (req, res) => res.render('events'));
app.get('/faq', (req, res) => res.render('faq'));
app.get('/quiz', (req, res) => res.render('quiz'));
app.get('/contact', (req, res) => res.render('contact'));

app.get('/register', (req, res) => {
  const eventName = req.query.event;
  const courseName = req.query.course;
  const nameToDisplay = eventName || courseName || 'Your Selection';
  res.render('register', { eventName, courseName, nameToDisplay });
});

app.post('/register', (req, res) => {
  const { name, email, event, course } = req.body;
  const selection = event || course;

  if (event) {
    db.run(
      'INSERT INTO registrations (name, email, event) VALUES (?, ?, ?)',
      [name, email, event],
      function (err) {
        if (err) {
          console.error('❌ Event registration failed:', err.message);
          return res.send('Something went wrong. Please try again.');
        }

        sendConfirmationEmail(email, name, event);

        res.send(`<h2>✅ Thank you, ${name}! You've registered for the event "${event}".</h2><a href="/events">Back to Events</a>`);
      }
    );
  } else if (course) {
    db.run(
      'INSERT INTO course_registrations (name, email, course) VALUES (?, ?, ?)',
      [name, email, course],
      function (err) {
        if (err) {
          console.error('❌ Course registration failed:', err.message);
          return res.send('Something went wrong. Please try again.');
        }

        sendConfirmationEmail(email, name, course);

        res.send(`<h2>✅ Thank you, ${name}! You've registered for the course "${course}".</h2><a href="/courses">Back to Courses</a>`);
      }
    );
  } else {
    res.send('❌ Missing registration data.');
  }
});

app.post('/submit_query', (req, res) => {
  const { name, email, message } = req.body;
  db.run(
    'INSERT INTO contact (name, email, message) VALUES (?, ?, ?)',
    [name, email, message],
    function (err) {
      if (err) {
        console.error('❌ Form submission failed:', err.message);
        res.send('Something went wrong. Please try again.');
      } else {
        res.send('<h2>✅ Thank you! Your message has been submitted.</h2><a href="/">Return to homepage</a>');
      }
    }
  );
});

app.get('/registrations', (req, res) => {
  db.all('SELECT * FROM registrations', (err1, eventRegs) => {
    db.all('SELECT * FROM course_registrations', (err2, courseRegs) => {
      if (err1 || err2) {
        return res.send('Failed to load registrations.');
      }
      res.render('registrations', { eventRegs, courseRegs });
    });
  });
});

function sendConfirmationEmail(to, name, selection) {
  const mailOptions = {
    from: 'your-email@gmail.com',
    to,
    subject: `Registration Confirmation for ${selection}`,
    text: `Hi ${name},\n\nYou’re successfully registered for "${selection}".\n\nThank you!\nOnline Learning Platform`
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('❌ Email failed:', err.message);
    } else {
      console.log(`📧 Confirmation sent: ${info.response}`);
    }
  });
}

app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});
