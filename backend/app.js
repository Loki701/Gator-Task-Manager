const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const usersRouter = require('./routers/users')
const authRouter = require('./routers/authentication')
const errorHandler = require('./helper/error-handler')

const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config()
const api = process.env.API_URL;


app.use(cors());
//allow all http request
app.options("*", cors());


//middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(errorHandler);


//Routers
app.use(`${api}/users`, usersRouter)
app.use(`${api}/auth`, authRouter)

//Database connection
mongoose.connect(process.env.CONNECTION_STRING,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'gator-management-database'
})
.then(() =>{
    console.log('Database connection is ready!');
})
.catch((err) =>{
    console.log(err);
})

//app connection
app.listen(3000, ()=>{
    console.log("Server is running http://localhost:3000");
})