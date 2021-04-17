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
			fileBuffer: Buffer,
			submissions: [
				{
					email: String,
					time: Number,
					grade: Number,
					graded: Boolean,
					doc: Buffer
				}
			]
		}
	]
});

const Class = new mongoose.model('Class', classSchema);

module.exports = Class;
