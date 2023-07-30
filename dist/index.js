import express from 'express';
import { useRouter } from './users/users.js';
const port = 8000;
const app = express();
app.use((req, res, next) => {
    console.log('Время ', Date.now());
    next();
});
app.get('/', (req, res) => {
    res.send('home');
    res.end();
});
app.use('/users', useRouter);
app.use((err, req, res, next) => {
    console.log(err.message);
    res.status(401).send(err.message);
});
app.listen(port, () => {
    console.log('run');
});
