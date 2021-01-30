const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const questionsRouter = require('./controllers/questions');
const config = require('./utils/config');
const logger = require('./utils/logger');

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
app.use('/api/questions', questionsRouter);

module.exports = app;
