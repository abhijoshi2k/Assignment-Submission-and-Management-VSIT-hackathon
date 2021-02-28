const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: [true, 'Email Address Required'],
		trim: true,
		lowercase: [true, 'Invalid Email Address'],
		unique: [true, 'You have already Registered!']
	},
	name: { type: String },
	adminClass: [],
	memberClass: [],
	emailValidationHash: {type: String},
	emailConfirmed: {type: Boolean, default: false}
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model('User', userSchema);

module.exports = User;
