import express from 'express';
import api from './routes/api/api.js';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/api', api);

export function init(){
    app.listen(port, () => {
        console.log(`KeepOpen enabled with server.`);
        console.log(`Listening on port ${port}`);
    });
}