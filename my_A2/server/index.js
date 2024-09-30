// express
const express = require('express');
// cors request
const cors = require('cors');
// body parser
const bodyParser = require('body-parser');
// api list
const serverApi = require('./api');

const server = express();
server.use(cors());
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: false }));
//request prefix
server.use('/api', serverApi);

//让服务器监听3000的端口   listen 3000
server.listen(3000);
//输出信息
console.log('listening, port：3000'); 