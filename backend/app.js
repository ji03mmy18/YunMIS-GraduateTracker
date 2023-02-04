let express = require('express');
let path = require('path');
let cors = require('cors');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let dataRouter = require('./routes/data');
let manageRouter = require('./routes/manage');

let app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/data', dataRouter);
app.use('/api/manage', manageRouter);

module.exports = app;
