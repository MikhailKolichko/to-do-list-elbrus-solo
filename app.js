const express = require('express');


const morgan = require('morgan');
const handlebars = require('express-handlebars');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const FileStore = require('session-file-store')(session);
const { connect } = require('mongoose');
const User = require('./models/user');
const { cookiesCleaner } = require("./middleware/auth");
const passport = require('passport');
const bodyParser = require("body-parser");
const FacebookStrategy = require('passport-facebook')

const app = express();
// passport

app.use(
  session({
    store: new FileStore({}),
    key: 'user_sid',
    secret: 'anything here',
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60000000,
    },
  }),
);

//app.use(session({ secret: '72e52d6b6517fe86634ef2e6e8424636' }));
app.use(passport.initialize());
app.use(passport.session());

const initPassport = require('./passport/init');
initPassport(passport)

// google

// 

app.use(morgan('dev'));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(cookieParser());


connect("mongodb://localhost:27017/PartyApp", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});



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
