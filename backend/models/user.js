const mongoose = require('mongoose');

// const eventSchema = mongoose.Schema({ 
//     title: {
//         type: String,
//         required: true
//     },
//     description: String,
//     time: Number,
//     offset: Number
// })

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    events: [{
        title: {
            type: String,
            required: true
        },
        description: String,
        time: Number,
        offset: Number
    }],
    moodRecord: [{
        mood: Number,
        date: Number
    }]

});

// create virtual identifier
// userSchema.virtual('id').get(function (){
//     return this._id.toHexString();
// });
// userSchema.set('toJSON', {
//     virtuals: true,
// });

exports.User = mongoose.model('User', userSchema);
//exports.Event = mongoose.model('Event', eventSchema);
exports.userSchema = userSchema;