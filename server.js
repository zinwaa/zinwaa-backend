
import fetchSomeData from './db/db.js';


//引入express
import express from 'express';
const app = express();

//引入session
import session from 'express-session';
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 6
    }
}));

// 解决cors跨域问题
import cors from 'cors';
app.use(cors())

// 解决post请求参数问题
import bodyParser from 'body-parser';
app.use(bodyParser.json({ strict: false }));

const port = process.env.PORT || 3000;

// 登录
app.post('/api/login', async (req, res) => {
    let result = {
        status: false,
        message: '登录失败', // 默认消息
    };
    const { username, password } = req.body;
    const usersql = `SELECT username,user_password FROM user where username = '${username}'`;
    try {
        const sqlResult = await fetchSomeData(usersql);
        console.log(sqlResult);
        if (sqlResult.length === 0) {
            result = {
                status: false,
                message: '无此账号，请先注册',
            }
        } else if (sqlResult[0].user_password !== password) {
            result = {
                status: false,
                message: '密码错误，请重新输入',
            }
        } else {
            req.session.username = username;
            result = {
                status: true,
                message: `登录成功,欢迎您：${username}`,
                username: req.session.username
            }
        }
    } catch (err) {
        console.log(err);
    } finally {
        res.send(result);
    }
});

// 注册
app.post('/api/register', async (req, res) => {
    let result = {
        status: false,
        message: '登录失败', // 默认消息
    };
    const { username, password } = req.body;
    const usersql = `SELECT username,user_password FROM user where username = ?`;
    try {
        const sqlResult = await fetchSomeData(usersql, [username]);
        console.log(sqlResult);
        if (sqlResult.length !== 0) {
            result = {
                status: false,
                message: '此账号已存在，请重新输入',
            }
        } else {
            const insertsql = `INSERT INTO user (username,user_password) VALUES (?,?)`;
            const insertResult = await fetchSomeData(insertsql, [username, password]);
            if (insertResult && insertResult.affectedRows > 0) {
                result = {
                    status: true,
                    message: '注册成功,快去登录吧~',
                }
            } else {
                result = {
                    status: false,
                    message: '注册失败',
                }
            }
        }
    } catch (err) {
        console.error('注册错误:', err);
        // 更细致的错误处理
        if (err.code === 'ER_DUP_ENTRY') {
            result.message = '此账号已存在，请重新输入';
        } else {
            result.message = '注册失败，请稍后尝试';
        }
        res.send(result);
    } finally {
        res.send(result);
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
