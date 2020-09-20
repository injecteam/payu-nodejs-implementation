'use strict';

// Libs
const express = require('express');
// Configs
const { APPLICATION } = require('./config');

const app = express();

app.get('/', (req, res) => res.send('Hello'));

app.listen(APPLICATION.PORT, APPLICATION.HOST);
