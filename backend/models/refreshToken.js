const mongoose = require('mongoose');

const refreshTokenSchema = mongoose.Schema({
    refreshToken: {
        type: String,
        required: true
    }
})

exports.RefreshToken = mongoose.model('refreshToken', refreshTokenSchema);
exports.refreshTokenSchema = refreshTokenSchema;