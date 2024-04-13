// 引入数据库封装对象
import { db } from './db.js';
// 引入express包
import express from 'express';

//创建路由器对象
var router = express.Router();

// 配置路由对象
router.get('/userList', (req, res, next) => {
    // sql查询user表
    db.query('select * from list', [], function (results, fields) {
        // 以json的形式返回
        res.json({ results })
    })
})