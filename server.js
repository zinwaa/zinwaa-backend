
import fetchSomeData from './db/db.js';


//引入express
import express from 'express';
const app = express();

// 解决cors跨域问题
import cors from 'cors';
app.use(cors())

// 解决post请求参数问题
import bodyParser from 'body-parser';
app.use(bodyParser.json({ strict: false }));

const port = process.env.PORT || 3000;

// 登录
app.post('/api/login', (req, res) => {
    let result;
    const { username, password } = req.body;
    const usersql = `SELECT username,user_password FROM user where username = '${username}'`;
    const sqlResult = async () => await fetchSomeData(usersql);
    console.log(sqlResult);
    if (sqlResult) {
        result = {
            status: false,
            message: '无此账号，请先注册',
        }
    } else if (sqlResult.user_password !== password) {
        result = {
            status: false,
            message: '密码错误，请重新输入',
        }
    } else {
        result = {
            status: true,
            message: `登录成功,欢迎您：${username}`,
        }
    }
    console.log(result);
    res.send(result);
});



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
