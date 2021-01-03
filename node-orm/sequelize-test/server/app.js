"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var sequelize_1 = require("sequelize");
var app = express_1.default();
var sequelize = new sequelize_1.Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    database: 'students',
    username: 'root',
    password: '123456'
});
app.get('/', function (req, res) {
    console.log('req = ', req, '\nres = ', res);
    res.send('Hello World');
});
app.listen(3000, function () {
    console.log('server is on 3000');
});
//# sourceMappingURL=app.js.map