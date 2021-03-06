require('express-async-errors');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const questionsRouter = require('./controllers/questions');
const usersRouter = require('./controllers/users');
const config = require('./utils/config');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');

const app = express();

mongoose
	.connect(config.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true
	})
	.then(() => {
		logger.info('connected to MongoDB');
	})
	.catch((error) => {
		logger.error('error connecting to MongoDB:', error.message);
	});

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/questions', questionsRouter);
app.use('/api/users', usersRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
