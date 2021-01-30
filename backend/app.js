const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const questionsRouter = require('./controllers/questions');
const config = require('./utils/config');

const app = express();
mongoose
	.connect(config.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true
	})
	.then(() => {
		console.log('connected to MongoDB');
	})
	.catch((error) => {
		console.log('error connecting to MongoDB:', error.message);
	});

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use('/api/questions', questionsRouter);

module.exports = app;
