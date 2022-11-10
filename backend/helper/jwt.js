const {expressjwt: jwt} = require('express-jwt');
require('dotenv/config');

function authJwt() {
    const token = process.env.ACCESS_TOKEN_SECRET;
    return jwt({
        secret: token,
        algorithms: ["HS256"]
    })
}

module.exports = authJwt;