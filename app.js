const express = require('express');

const app = express();

const morgan = require('morgan');
const handlebars = require('express-handlebars');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const FileStore = require('session-file-store')(session);
const { connect } = require('mongoose');
const { cookiesCleaner } = require("./middleware/auth");

app.use(morgan('dev'));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(cookieParser());

const fileStoreOptions = {};

connect("mongodb://localhost:27017/PartyApp", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(
  session({
    store: new FileStore(fileStoreOptions),
    key: 'user_sid',
    secret: 'anything here',
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60000000,
    },
  }),
);

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use(cookiesCleaner);

// Импорт маршрутов.
const indexRouter = require('./routes/index');
const partyRouter = require('./routes/party');

// Подключаем статику
app.use(express.static(path.join(__dirname, 'public')));

// Подключаем views(hbs)
const hbs = handlebars.create({
  defaultLayout: 'layout',
  extname: 'hbs',
  layoutsDir: path.join(__dirname, 'views'),
  partialsDir: path.join(__dirname, 'views/'),
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine);

// Подключаем импортированные маршруты с определенным url префиксом.
app.use('/', indexRouter);
app.use('/party', partyRouter);

// Обработка ошибок.
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
