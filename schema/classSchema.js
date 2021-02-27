const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
	code: {
		type: String,
		required: true,
		unique: true
	},
	name: { type: String, required: true },
	admin: { type: String, required: true },
	members: [],
	assignments: [
		{
			givenDate: Number,
			dueDate: Number,
			title: String,
			description: String,
			submissions: [
				{
					email: String,
					time: Number,
					note: String,
					grade: Number,
					graded: Boolean
				}
			]
		}
	]
});

const Class = new mongoose.model('Class', classSchema);

module.exports = Class;
