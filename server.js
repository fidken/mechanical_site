const PIN_CODE = '1234'; // Ваш PIN-код

const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

const nodemailer = require('nodemailer');

// Middleware
app.use(bodyParser.json());
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Конфигурация для почты Mail.ru
const transporter = nodemailer.createTransport({
  host: 'smtp.mail.ru',
  port: 465,
  secure: true, // true для 465, false для других портов
  auth: {
    user: 'yefremevi@mail.ru', // замените на вашу почту Mail.ru
    pass: 'tnEaUbqmcjqGJLeRcCWz'   // пароль приложения из настроек Mail.ru
  },
});

const fieldNamesMap = {
  price: 'Стоимость заказа',
  service: 'Услуга',
  comment: 'Комментарий',
  orderStatus: 'Статус заказа',
  paymentStatus: 'Статус оплаты',
  customerInfo: 'Информация о клиенте',
  'customerInfo.name': 'ФИО клиента',
  'customerInfo.phone': 'Номер телефона клиента',
  'customerInfo.email': 'Электронная почта клиента',
};



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

// Load initial data
let orders = [];
if (fs.existsSync(dbPath)) {
  orders = readDatabase();
} else {
  writeDatabase(orders);
}

// Endpoint to receive orders
// Endpoint to receive orders
app.post('/api/orders', async (req, res) => {
  console.log('1');
  const { customerInfo, comment, price, service } = req.body;

  if (!customerInfo || !price) {
    return res.status(400).json({ message: 'Invalid order data' });
  }
  console.log("ЦЕНА " + price);
  const newOrder = {
    id: orders.length + 1,
    customerInfo,
    comment: comment || '',
    price,
    service,
    paymentStatus: 'не оплачено',
    orderStatus: 'выполняется',
  };

  orders.push(newOrder);
  writeDatabase(orders); // Функция для записи в базу данных

  // Отправка уведомления пользователю
  try {
    await transporter.sendMail({
      from: '"Служба поддержки ИП Александров" <yefremevi@mail.ru>', // Замените на вашу почту
      to: customerInfo.email, // Предполагается, что email находится в customerInfo
      subject: 'Ваш заказ принят',
      text: `Здравствуйте, ${customerInfo.name}!

Спасибо, что обратились к нам. Мы получили ваш заказ и приступили к его обработке.

Детали вашего заказа:
- Имя: ${customerInfo.name}
- Телефон: ${customerInfo.phone}
- Email: ${customerInfo.email}
- Услуга: ${service}
- Цена: ${price}
- Комментарий: ${comment || 'отсутствует'}

Ваш заказ находится в статусе: "выполняется". Мы свяжемся с вами, чтобы обсудить дальнейшие шаги и сроки.

Если у вас появились вопросы, свяжитесь с нами:
- Телефон: +7 921 711 2494
- Почта: aleksandrovevg09@rambler.ru

Ещё раз спасибо, что выбрали нас! 

С уважением,  
ИП Александров  
Телефон: +7 921 711 2494  
Почта: aleksandrovevg09@rambler.ru
`
      // text: `Уважаемый(ая) ${customerInfo.name},\n\nБлагодарим вас за ваш заказ! Мы успешно получили вашу заявку.\n\nИнформация о заказе:\n\nФИО: ${customerInfo.name}\nНомер телефона: ${customerInfo.phone}\nЭлектронная почта: ${customerInfo.email}\nУслуга: ${service}\nСтоимость: ${price}\nКомментарий: ${comment || 'нет комментариев'}\n\nВаш заказ сейчас находится в статусе: "выполняется".\n\nМы свяжемся с вами в ближайшее время, чтобы уточнить детали и сроки выполнения вашего заказа.\n\nЕсли у вас есть вопросы или пожелания, вы всегда можете связаться с нами:\n\nТелефон: [Сюда вставляем номер поддержки]\nЭлектронная почта: [Сюда вставляем контактную почту]\n\nСпасибо, что выбрали нас!\n\nС уважением,\n[Название компании]\n[Контактная информация]`,
    });
    await transporter.sendMail({
      from: '"Служба поддержки ИП Александров" <yefremevi@mail.ru>', // Замените на вашу почту
      to: "yefremevi@mail.ru", // Предполагается, что email находится в customerInfo
      subject: 'Поступил заказ',
      text: `Здравствуйте, ${customerInfo.name}!

Поступил новый заказ.

Детали вашего заказа:
- Имя: ${customerInfo.name}
- Телефон: ${customerInfo.phone}
- Email: ${customerInfo.email}
- Услуга: ${service}
- Цена: ${price}
- Комментарий: ${comment || 'отсутствует'}

С уважением,  
ИП Александров  
Телефон: +7 921 711 2494  
Почта: aleksandrovevg09@rambler.ru
`
      // text: `Уважаемый(ая) ${customerInfo.name},\n\nБлагодарим вас за ваш заказ! Мы успешно получили вашу заявку.\n\nИнформация о заказе:\n\nФИО: ${customerInfo.name}\nНомер телефона: ${customerInfo.phone}\nЭлектронная почта: ${customerInfo.email}\nУслуга: ${service}\nСтоимость: ${price}\nКомментарий: ${comment || 'нет комментариев'}\n\nВаш заказ сейчас находится в статусе: "выполняется".\n\nМы свяжемся с вами в ближайшее время, чтобы уточнить детали и сроки выполнения вашего заказа.\n\nЕсли у вас есть вопросы или пожелания, вы всегда можете связаться с нами:\n\nТелефон: [Сюда вставляем номер поддержки]\nЭлектронная почта: [Сюда вставляем контактную почту]\n\nСпасибо, что выбрали нас!\n\nС уважением,\n[Название компании]\n[Контактная информация]`,
    });
  } catch (error) {
    console.error('Ошибка при отправке письма:', error);
    return res.status(500).json({ message: 'Не удалось отправить уведомление.' });
  }

  res.status(201).json(newOrder);
});

// Endpoint to update order status or payment status
app.put('/api/orders/:id', async (req, res) => {
  console.log("Получен запрос на обновление");
  const orderId = parseInt(req.params.id, 10);
  const { field, value } = req.body;

  if (isNaN(orderId) || !field || value === undefined) {
    return res.status(400).json({ message: 'Invalid request data' });
  }

  // Найти заказ по ID
  const order = orders.find(order => order.id === orderId);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  // Обновить указанное поле (поддержка вложенных полей)
  const fieldParts = field.split('.'); // Разделение по точке для вложенных полей
  let target = order;

  for (let i = 0; i < fieldParts.length - 1; i++) {
    if (!(fieldParts[i] in target)) {
      return res.status(400).json({ message: 'Invalid field name' });
    }
    target = target[fieldParts[i]]; // Переход к вложенному объекту
  }

  const finalField = fieldParts[fieldParts.length - 1];
  if (!(finalField in target)) {
    return res.status(400).json({ message: 'Invalid field name' });
  }

  target[finalField] = value;
  writeDatabase(orders); // Сохранить изменения в базе данных

// Отправка уведомления пользователю об обновлении заказа
try {
  await transporter.sendMail({
    from: '"Служба поддержки ИП Александров" <yefremevi@mail.ru>', // Замените на вашу почту
    to: order.customerInfo.email, // Email клиента
    subject: 'Обновление вашего заказа',
    text: `Здравствуйте, ${order.customerInfo.name}!

Информируем вас об обновлении в вашем заказе (ID: ${order.id}).

Что изменилось:
- Поле: ${fieldNamesMap[field] || field}
- Новое значение: ${value}

Текущие данные по вашему заказу:
- Имя: ${order.customerInfo.name}
- Телефон: ${order.customerInfo.phone}
- Email: ${order.customerInfo.email}
- Услуга: ${order.service}
- Цена: ${order.price}
- Комментарий: ${order.comment || 'отсутствует'}

Если потребуется уточнить что-то ещё, пишите или звоните:
- Телефон: +7 921 711 2494
- Почта: aleksandrovevg09@rambler.ru

Мы ценим ваше доверие и готовы помочь в любой момент!

С уважением,  
ИП Александров  
Телефон: +7 921 711 2494  
Почта: aleksandrovevg09@rambler.ru
`
    // text: `Уважаемый(ая) ${order.customerInfo.name},\n\nМы обновили информацию по вашему заказу (ID: ${order.id}).\n\nОбновление:\n\nПоле: ${fieldNamesMap[field] || field}\nНовое значение: ${value}\n\nТекущая информация по вашему заказу:\n\nФИО: ${order.customerInfo.name}\nНомер телефона: ${order.customerInfo.phone}\nЭлектронная почта: ${order.customerInfo.email}\nУслуга: ${order.service}\nСтоимость: ${order.price}\nКомментарий: ${order.comment || 'нет комментариев'}\n\nЕсли у вас есть вопросы или пожелания, пожалуйста, свяжитесь с нами:\n\nТелефон: [Укажите ваш номер поддержки]\nЭлектронная почта: [Укажите вашу контактную почту]\n\nСпасибо за ваше доверие!\n\nС уважением,\n[Название компании]\n[Контактная информация]`,
  });
  
} catch (error) {
  console.error('Ошибка при отправке письма:', error);
  return res.status(500).json({ message: 'Не удалось отправить уведомление об обновлении.' });
}


  return res.status(200).json(order);
});





// Проверка PIN-кода и установка cookie
// Маршрут для админки с проверкой аутентификации
// app.get('/admin', (req, res) => {
//   if (req.cookies.auth === 'true') {
//     res.render('pages/admin', { orders });
//   } else {
//     // Если нет доступа, перенаправляем на страницу входа
//     res.redirect('/login'); // или res.status(403).send('Access denied');
//   }
// });
app.get('/admin', (req, res) => {
    res.render('pages/admin', { orders });
});
// Роут для страницы входа
// app.get('/login', (req, res) => {
//   res.render('login'); // Страница с формой для ввода PIN-кода
// });

// Роут для обработки PIN-кода (для POST-запросов)
// app.post('/login', (req, res) => {
//   const { pin } = req.body;
//   if (pin === PIN_CODE) {
//     res.cookie('auth', 'true', {
//       httpOnly: true, // Защита от доступа через JS
//       secure: false,  // Включите true для HTTPS
//     });
//     return res.status(200).json({ message: 'Access granted' });
//   }
//   res.status(401).json({ message: 'Invalid PIN' });
// });



// Обработчик отправки сообщения
app.post('/send-message', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).send('Заполните все поля!');
  }

  try {
    // Настройка письма
    await transporter.sendMail({
      from: '"Служба поддержки ИП Александров" dayzmob@bk.ru', // замените на вашу почту
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
//   const db = readDatabase();
//   const photos = [
//     '/images/photo1.jpg',
//     '/images/photo2.jpg',
//     '/images/photo3.jpg'
// ]; 
//   res.render('index', { photos,services: db.services, portfolio: db.portfolio });
res.render('pages/services', { title: 'УСЛУГИ' });
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
