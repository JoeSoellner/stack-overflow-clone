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

questionsRouter.delete('/:id', async (request, response) => {
	await Question.findByIdAndRemove(request.params.id);
	response.status(204).end();
});

questionsRouter.put('/:id', async (request, response) => {
	const { body } = request;

	const question = {
		title: body.title,
		likes: body.likes,
		content: body.content,
		views: body.views,
		tags: body.tags
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
