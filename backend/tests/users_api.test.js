const mongoose = require('mongoose');
const supertest = require('supertest');
const usersTestHelper = require('./usersTestHelper');
const User = require('../models/user');
const app = require('../app');

const api = supertest(app);

beforeEach(async () => {
	await User.deleteMany({});

	const userObjects = usersTestHelper.initialUsers.map(
		(user) => new User(user)
	);
	const promiseArray = userObjects.map((user) => user.save());
	await Promise.all(promiseArray);
});

describe('GET api/users', () => {
	test('users are returned as JSON with status 200', async () => {
		await api
			.get('/api/users')
			.expect(200)
			.expect('Content-Type', /application\/json/);
	});

	test('correct number of users are returned', async () => {
		const response = await api.get('/api/users');
		expect(response.body).toHaveLength(usersTestHelper.initialUsers.length);
	});

	test('id is defined', async () => {
		const response = await api.get('/api/users');
		expect(response.body[0].id).toBeDefined();
	});

	test('name is defined', async () => {
		const response = await api.get('/api/users');
		expect(response.body[0].name).toBeDefined();
	});

	test('username is defined', async () => {
		const response = await api.get('/api/users');
		expect(response.body[0].username).toBeDefined();
	});

	test('creation date is defined', async () => {
		const response = await api.get('/api/users');
		console.log(response.body[0]);
		expect(response.body[0].creationDate).toBeDefined();
	});

	test('questions is defined', async () => {
		const response = await api.get('/api/users');
		expect(response.body[0].questions).toBeDefined();
	});

	test('passwordHashes are not returned', async () => {
		const response = await api.get('/api/users');
		expect(response.body[0].passwordHash).not.toBeDefined();
	});
});

describe('POST api/users', () => {
	test('user returned as JSON with status 201 after post', async () => {
		await api
			.post('/api/users')
			.send(usersTestHelper.additionalUser)
			.expect(201)
			.expect('Content-Type', /application\/json/);
	});

	test('correct user returned', async () => {
		const response = await api
			.post('/api/users')
			.send(usersTestHelper.additionalUser);

		expect(response.body.username).toBe(
			usersTestHelper.additionalUser.username
		);
	});

	test('user with no user name returns status 400', async () => {
		const userWithNoUsername = {
			name: 'noname',
			password: 'password'
		};

		await api.post('/api/users').send(userWithNoUsername).expect(400);
	});

	test('user with too short of a username fails', async () => {
		const userWithShortUsername = {
			username: 'jo',
			name: 'noname',
			password: 'password'
		};

		await api.post('/api/users').send(userWithShortUsername).expect(400);
	});

	test('user with perfect length username is added to database', async () => {
		const userWithPerfectUsername = {
			username: 'joe',
			name: 'noname',
			password: 'password'
		};

		await api.post('/api/users').send(userWithPerfectUsername).expect(201);

		const users = await api.get('/api/users');
		expect(
			usersTestHelper.usernameInListOfUsers(
				userWithPerfectUsername.username,
				users
			)
		);
	});

	test('user with no password returns status 400', async () => {
		const userWithNoPassword = {
			username: 'bill',
			name: 'noname'
		};

		await api.post('/api/users').send(userWithNoPassword).expect(400);
	});

	test('user with too short of a password fails', async () => {
		const userWithShortPassword = {
			username: 'jan',
			name: 'noname',
			password: 'passw'
		};

		await api.post('/api/users').send(userWithShortPassword).expect(400);
	});

	test('user with perfect length password is added to database', async () => {
		const userWithPerfectPassword = {
			username: 'rob',
			name: 'noname',
			password: 'passwo'
		};

		await api.post('/api/users').send(userWithPerfectPassword).expect(201);

		const users = await api.get('/api/users');
		expect(
			usersTestHelper.usernameInListOfUsers(
				userWithPerfectPassword.username,
				users
			)
		);
	});

	test('user with no name is added to database', async () => {
		const userWithNoName = {
			username: 'ihavenoname',
			password: 'password1234'
		};

		await api.post('/api/users').send(userWithNoName).expect(201);

		const users = await api.get('/api/users');
		expect(
			usersTestHelper.usernameInListOfUsers(
				userWithNoName.username,
				users
			)
		);
	});

	test('user with non-unique username fails', async () => {
		const userWithRepeatUsername = {
			username: 'bobIsCool',
			password: 'password1234'
		};

		await api.post('/api/users').send(userWithRepeatUsername).expect(400);
	});
});

afterAll(() => {
	mongoose.connection.close();
});
