const path = require('path');

const express = require("express");
require('dotenv').config({path: path.join(__dirname, './config/.env')})

const app =  express();


module.exports = app