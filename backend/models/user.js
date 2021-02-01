/* eslint-disable no-param-reassign */
// eslint wont play nice with modifying the schema
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		minlength: 3,
		required: true,
		unique: true
	},
	passwordHash: {
		type: String,
		minlength: 6,
		required: true
	},
	name: String,
	creationDate: Date,
	questions: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Question'
		}
	]
});

userSchema.plugin(uniqueValidator);

userSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
		delete returnedObject.passwordHash;
	}
});

module.exports = mongoose.model('User', userSchema);
