const path = require('path');
require('dotenv-flow').config({
    node_env: process.env.NODE_ENV || 'dev',
    silent: true
});

const {apiPath} = require('./appConstants');


const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const morgan = require('morgan');
const app = express();
const port = process.env.PORT || 4506

if (process.env.NODE_ENV === "prod") {
    app.use(morgan("combined"));
} else {
    // development
    app.use(morgan("dev"));
}
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
app.use(bodyParser.json({ limit: '50mb' }))

mongoose.Promise = global.Promise

mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true
    , useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false
})
    .then(() => console.log('Successfully connect to mongodb'))
    .catch(err => console.error(err))


app.use('/google', require('./routes/googles'))

app.listen(port, () => console.log(`Server listening on port ${port}`))