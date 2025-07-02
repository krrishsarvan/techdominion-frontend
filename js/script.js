const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

const DATA_FILE = path.join(__dirname, 'data.json');

// ✅ Middleware Setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Session Setup (IMPORTANT for login)
app.use(session({
  secret: 'supersecuresecret',
  resave: false,
  saveUninitialized: false
}));

// ✅ Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Serve login page (fix for Cannot GET /login)
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/login.html'));
});

// ✅ Handle login POST
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'krrishsarvan' && password === 'supremecoder05') {
    req.session.authenticated = true;
    res.json({ success: true });
  } else {
    res.json({ success: false, message: 'Invalid credentials' });
  }
});

// ✅ Protect admin.html route
app.get('/admin.html', (req, res) => {
  if (req.session.authenticated) {
    res.sendFile(path.join(__dirname, 'public/admin.html'));
  } else {
    res.redirect('/login');
  }
});

// ✅ API: Get all items
app.get('/api/items', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  res.json(data);
});

// ✅ API: Add item
app.post('/api/items', (req, res) => {
  const newItem = req.body;
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  data.push(newItem);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.status(201).json({ message: 'Item added successfully' });
});

// ✅ Start server (fix for crash error)
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
async function loadItems() {
  try {
    const res = await fetch('https://techdominion-backend.onrender.com/api/items');
    const items = await res.json();

    const softwareList = document.getElementById('software-list');
    const courseList = document.getElementById('course-list');

    softwareList.innerHTML = '';
    courseList.innerHTML = '';

    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card';
      card.dataset.name = item.name;

      card.innerHTML = `
        <img src="${item.img}" alt="${item.name}" class="product-img">
        <h3>${item.name}</h3>
        <p class="price"><span class="original-price">${item.originalPrice}</span> ${item.price}</p>
        <p>${item.desc}</p>
        <button onclick="redirectToTelegram('${item.name}')">Buy Now</button>
      `;

      if (item.category === 'software') {
        softwareList.appendChild(card);
      } else if (item.category === 'courses') {
        courseList.appendChild(card);
      }
    });
  } catch (error) {
    console.error('❌ Failed to load items:', error);
  }
}

window.addEventListener('DOMContentLoaded', loadItems);

