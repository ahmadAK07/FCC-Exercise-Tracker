const mongoose = require('mongoose');
const {ObjectId} = mongoose.Types;
const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    }
});
const Users = mongoose.model('Users', userSchema);


const exerciseSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: ObjectId,
        required: true
    }
});

const Exercises = mongoose.model('Exercises', exerciseSchema);
module.exports = { Users, Exercises };
