
import fetchSomeData from './db/db.js';



import express from 'express';
const app = express();
const port = 3000;
app.get('/', (req, res) => {
    const sql = 'SELECT * FROM user';
    const result = fetchSomeData(sql);
    console.log(result);
    res.send(result);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
