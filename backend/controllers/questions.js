const questionsRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Question = require('../models/question');
const User = require('../models/user');
const config = require('../utils/config');

const getTokenFrom = (request) => {
	const authorization = request.get('authorization');
	if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
		return authorization.substring(7);
	}
	return null;
};

questionsRouter.get('/', async (request, response) => {
	const questions = await Question.find({}).populate('user');
	response.status(200).json(questions);
});

questionsRouter.post('/', async (request, response) => {
	const token = getTokenFrom(request);
	const decodedToken = jwt.verify(token, config.SECRET);
	if (!token || !decodedToken.id) {
		response.status(401).json({ error: 'token missing or invalid' });
	}
	const user = await User.findById(decodedToken.id);

	const { body } = request;
	if (body.likes === undefined) body.likes = 0;

	const question = new Question({
		title: body.title,
		likes: body.likes,
		content: body.content,
		views: body.views,
		tags: body.tags,
		date: new Date(),
		user: user._id
	});

	const savedQuestion = await question.save();
	user.questions = user.questions.concat(savedQuestion.id);
	await user.save();
	response.status(201).json(savedQuestion);
});

questionsRouter.delete('/:id', async (request, response) => {
	const token = getTokenFrom(request);
	const decodedToken = jwt.verify(token, config.SECRET);
	if (!token || !decodedToken.id) {
		response.status(401).json({ error: 'token missing or invalid' });
	}
	const user = await User.findById(decodedToken.id);

	await Question.findByIdAndRemove(request.params.id);

	const removedQuestionIndex = user.questions.findIndex(
		(question) => question.id === request.params.id
	);
	user.questions = user.questions.splice(removedQuestionIndex, 1);

	response.status(204).end();
});

questionsRouter.put('/:id', async (request, response) => {
	const token = getTokenFrom(request);
	const decodedToken = jwt.verify(token, config.SECRET);
	if (!token || !decodedToken.id) {
		response.status(401).json({ error: 'token missing or invalid' });
	}

	const { body } = request;

	const question = {
		title: body.title,
		likes: body.likes,
		content: body.content,
		views: body.views,
		tags: body.tags,
		date: body.date
	};

	const updatedQuestion = await Question.findByIdAndUpdate(
		request.params.id,
		question,
		{
			new: true
		}
	);
	response.json(updatedQuestion);
});

module.exports = questionsRouter;
