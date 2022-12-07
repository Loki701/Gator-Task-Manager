const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const usersRouter = require('./routers/users')
const authRouter = require('./routers/authentication')
const errorHandler = require('./helper/error-handler')
const cookies = require('cookie-parser')
const port = process.env.PORT || 3000;

const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config()
const api = process.env.API_URL;


app.use(cors({
    origin: "http://localhost:3001",
    methods: "*",
    credentials: true
}));

// app.options('/*', (req, res) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length,Server,Date,access-control-allow-methods,access-control-allow-origin");
//     res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS,PATCH");
//     res.send('send some thing whatever')
//   })
//allow all http request
app.options("*", cors());


//middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(cookies());
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
app.listen(port, ()=>{
    console.log(`Server is running http://localhost:${port}`);
})