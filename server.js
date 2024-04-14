
import fetchSomeData from './db/db.js';



import express from 'express';
const app = express();
const port = 3000;
app.post('/api/login', (req, res) => {
    // const sql = 'SELECT * FROM user';
    // const result = fetchSomeData(sql);
    const result = [{ username: 'admin', password: '123456' }];
    console.log(result);
    res.send(result);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
