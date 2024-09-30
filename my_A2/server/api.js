/*
    nodejs 连接MySQL教程 https://www.runoob.com/nodejs/nodejs-mysql.html
    query方法教程 https://www.runoob.com/nodejs/nodejs-express-framework.html
*/
const mysql = require('mysql')  
const SQL = require('./sql')
// database config
const dbConfig = require('./dbConfig')
const express = require('express');
// 创建路由对象 Create routing object
const expressRouter = express.Router()

// connect database
const connection = mysql.createConnection(dbConfig)
connection.connect()

expressRouter
    // get organizer list
    .get('/organizer-list', (req, res) => {
        connection.query(SQL.organizer, function(err, data) {
            res.send(data)
        });
    })
    // get city list
    .get('/city-list', (req, res) => {
        connection.query(SQL.city, function(err, data) {
            res.send(data)
        });
    })
    // get category list
    .get('/category-list', (req, res) => {
        connection.query(SQL.category, function(err, data) {
            res.send(data)
        });
    })
    .get('/list', (req, res) => {
        req.query.category_id = req.query.category_id || null;
        req.query.organizer = req.query.organizer || null;
        req.query.city = req.query.city || null;
        const params = [req.query.category_id, req.query.category_id, req.query.organizer, req.query.organizer, req.query.city, req.query.city];
        connection.query(SQL.fundraiserList, params, function(err, data) {
            res.send(data);
        });
    })
    .get('/detail', (req, res) => {
        connection.query(SQL.detail, [req.query.fundraiser_id], function(err, data) {
            if (data) {
                res.send(data[0]);  //如果找到数据，发送回第一个结果  If data is found, send back the first result
            }
        });
    })

    //导出路由 Export route
module.exports = expressRouter