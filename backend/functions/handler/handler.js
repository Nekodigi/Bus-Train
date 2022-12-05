
const express = require('express');
const bodyParser = require('body-parser');
const { updatePaths } = require('./api/path');
const cors = require('cors');

const app = express();

app.use(cors());


app.get('/api/update/all', updatePaths);
app.get('/api/status/hour', (req, res) => {res.send(new Date().getDate()+","+new Date().getHours())})


app.use(bodyParser.json());

exports.app = app;