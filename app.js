const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { ToadScheduler, SimpleIntervalJob, AsyncTask } = require('toad-scheduler');

const indexRouter = require('./routes/index');
const {updateTrends} = require("./utils/updateData");

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// setup automatic tasks
const scheduler = new ToadScheduler();
const task = new AsyncTask(
    "update all trends",
    updateTrends,
    (err) => {console.log(err)}
);
const job = new SimpleIntervalJob({minutes: 30}, task);
scheduler.addSimpleIntervalJob(job);

module.exports = app;
