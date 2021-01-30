/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const questionSchema = new mongoose.Schema({
	title: {
		type: String,
		minlength: 10,
		required: true,
		unique: true
	},
	likes: Number,
	content: {
		type: String,
		minlength: 10,
		required: true
	},
	views: Number,
	date: Date,
	tags: [String]
	// user: {
	// type: mongoose.Types.ObjectId
	// ref: 'User'
	// }
});

questionSchema.plugin(uniqueValidator);

questionSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	}
});

module.exports = mongoose.model('Question', questionSchema);
