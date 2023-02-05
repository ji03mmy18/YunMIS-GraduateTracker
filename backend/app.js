let express = require('express');
let path = require('path');
let cors = require('cors');
let session = require('express-session');
let memoryStore = require('memorystore')(session);
let logger = require('morgan');

let dataRouter = require('./routes/data');
let manageRouter = require('./routes/manage');

let app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
}));
app.use(session({
  cookie: { maxAge: 3600000 }, // 1小時無效
  store: new memoryStore({
    checkPeriod: 14400000 // 4小時清理
  }),
  name: 'gradu',
  secret: process.env.SESS_SECRET,
  rolling: true,
  resave: false,
  saveUninitialized: true,
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/data', dataRouter);
app.use('/api/manage', manageRouter);

module.exports = app;
