const questionsRouter = require('express').Router();
const Question = require('../models/question');

questionsRouter.get('/', async (request, response) => {
	const questions = await Question.find({});
	response.status(200).json(questions);
});

questionsRouter.post('/', async (request, response) => {
	const { body } = request;
	if (body.likes === undefined) body.likes = 0;

	const question = new Question({
		title: body.title,
		likes: body.likes,
		content: body.content,
		views: body.views,
		tags: body.tags
	});

	const savedQuestion = await question.save();
	response.status(201).json(savedQuestion);
});

module.exports = questionsRouter;
