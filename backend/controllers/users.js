const usersRouter = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

const minPasswordLength = 6;

usersRouter.get('/', async (request, response) => {
	const users = await User.find({}).populate('questions');
	response.json(users);
});

usersRouter.post('/', async (request, response) => {
	const { body } = request;

	// have to check password requirements here because it is immediately encrypted
	if (!body.password || body.password.length < minPasswordLength)
		response.status(400).json({ error: 'content missing' });

	const saltRounds = 10;
	const passwordHash = await bcrypt.hash(body.password, saltRounds);

	const newUser = new User({
		username: body.username,
		name: body.name,
		passwordHash,
		questions: [],
		creationDate: new Date()
	});

	const result = await newUser.save();
	response.status(201).json(result);
});

module.exports = usersRouter;
