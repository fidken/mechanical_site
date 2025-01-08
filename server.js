const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

// Middleware
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Simulated JSON Database
const dbPath = path.join(__dirname, 'db.json');

// Read database
function readDatabase() {
  return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
}

// Write to database
function writeDatabase(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// Конфигурация для почты Mail.ru
const transporter = nodemailer.createTransport({
  host: 'smtp.mail.ru',
  port: 465,
  secure: true, // true для 465, false для других портов
  auth: {
    user: 'dayzmob@bk.ru', // замените на вашу почту Mail.ru
    pass: 'mt1Wm0KrVyKD28eMqbLT'   // пароль приложения из настроек Mail.ru
  },
});

// Обработчик отправки сообщения
app.post('/send-message', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).send('Заполните все поля!');
  }

  try {
    // Настройка письма
    await transporter.sendMail({
      from: '"Служба поддержки" dayzmob@bk.ru', // замените на вашу почту
      to: email,
      subject: 'Ваше сообщение принято',
      text: `Здравствуйте, ${name}!\n\nМы получили ваше сообщение:\n${message}\n\nСпасибо за обращение!`,
    });

    res.status(200).send('Сообщение отправлено!');
  } catch (error) {
    console.error('Ошибка при отправке письма:', error);
    res.status(500).send('Не удалось отправить сообщение.');
  }
});

// Routes
app.get('/', (req, res) => {
  const db = readDatabase();
  const photos = [
    '/images/photo1.jpg',
    '/images/photo2.jpg',
    '/images/photo3.jpg'
]; 
  res.render('index', { photos,services: db.services, portfolio: db.portfolio });
});

app.get('/api/services', (req, res) => {
  const db = readDatabase();
  res.json(db.services);
});

app.get('/api/portfolio', (req, res) => {
  const db = readDatabase();
  res.json(db.portfolio);
});

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const db = readDatabase();
  db.contacts.push({ name, email, message, date: new Date() });
  writeDatabase(db);

  res.json({ success: true, message: 'Your message has been received.' });
});

// Routes
app.get('/about', (req, res) => {
    res.render('pages/about', { title: 'О НАС' });
  });
  
  app.get('/services', (req, res) => {
    res.render('pages/services', { title: 'УСЛУГИ' });
  });
  
  app.get('/portfolio', (req, res) => {
    res.render('pages/portfolio', { title: 'ПОРТФОЛИО' });
  });
  
  app.get('/logout', (req, res) => {
    res.render('pages/logout', { title: 'ВЫХОД' });
  });

  

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Example db.json structure:
/*
{
  "services": [
    {
      "category": "Отделочные работы",
      "details": [
        "вызов мастера",
        "вызов специалиста"
      ]
    },
    {
      "category": "Монтажные работы систем вентиляции и кондиционирования",
      "details": [
        "инженерное проектирование систем вентиляции и кондиционирования",
        "вызов мастера на обслуживание систем вентиляции и кондиционирования",
        "полный спектр услуг на монтажные работы"
      ]
    },
    {
      "category": "Монтажные работы систем отопления",
      "details": [
        "проектирование объекта",
        "монтаж сантехники",
        "прокладка металлических и пластиковых труб",
        "вызов специалистов по осмечиванию",
        "вызов мастера"
      ]
    },
    {
      "category": "Транспортные услуги",
      "details": [
        "Перевозка малогабаритных грузов",
        "калькуляция"
      ]
    }
  ],
  "portfolio": [
    {
      "title": "Пример работы 1",
      "description": "Описание примера работы 1"
    },
    {
      "title": "Пример работы 2",
      "description": "Описание примера работы 2"
    }
  ],
  "contacts": []
}
*/
