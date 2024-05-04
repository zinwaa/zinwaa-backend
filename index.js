
import fetchSomeData from './db/db.js';


//引入express
import express from 'express';
const app = express();

//引入session
import session from 'express-session';
app.use(session({
    secret: 'NPIhpOsdfasAIJSuFahjHKFadsDOAJ-ZinWaa',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60
    }
}));

// 解决cors跨域问题
import cors from 'cors';
app.use(cors())

// 解决post请求参数问题
import bodyParser from 'body-parser';
app.use(bodyParser.json({ strict: false }));

const port = 3000;

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

//-------------------------------------------- sql语句生成器 --------------------------------------------

//---------------------------------------------- table 表 ----------------------------------------------
app.post('/api/sqlcreate/table/addTable', async (req, res) => {
    let result = {
        status: false,
        message: '保存表失败', // 默认消息
    };
    const { data, time, title, userid } = req.body;
    const sql = `SELECT userid,title FROM SQLtable where userid = ? AND title = ?`;
    try {
        const sqlResult = await fetchSomeData(sql, [userid, title]);

        if (sqlResult.length !== 0) {
            result = {
                status: false,
                message: '此表已存在，请重新输入',
            }
        } else {
            const insertsql = `INSERT INTO SQLtable (userid,title,tableData,time) VALUES (?,?,?,?)`;
            const insertTable = await fetchSomeData(insertsql, [userid, title, data, time]);
            if (insertTable && insertTable.affectedRows > 0) {
                result = {
                    status: true,
                    message: '已成功保存该表',
                }
            } else {
                result = {
                    status: false,
                    message: '保存表失败',
                }
            }
        }
    } catch (err) {
        console.log(err);
    } finally {
        res.send(result);
    }
})
// 获取表
app.post('/api/sqlcreate/table/getTable', async (req, res) => {
    let result = {
        status: false,
        message: '获取表失败',
        data: [], // 默认消息
    };
    const { userid } = req.body;

    // 构建SQL查询条件，如果userid为空，则查询所有记录
    const sqlCondition = userid ? `userid = ?` : '1 = 1';
    const sqlParams = userid ? [userid] : [];

    try {
        // 动态插入条件
        const sql = `SELECT userid,title,tableData,time FROM SQLtable WHERE ${sqlCondition}`;
        const sqlResult = await fetchSomeData(sql, sqlParams);

        if (sqlResult.length !== 0) {
            result = {
                status: true,
                message: '获取表成功',
                data: sqlResult
            };
        } else {
            // 即使没有数据，也不应视为错误，可能是正常情况
            result = {
                status: true,
                message: '没有找到相关记录',
                data: []
            };
        }
    } catch (err) {
        console.error(err); // 使用console.error更好地记录错误
        result.message = '获取表时发生错误'; // 更新错误信息
    } finally {
        res.send(result);
    }
});




app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
