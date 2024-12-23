import { JSONFilePreset } from 'lowdb/node';
import express from 'express';
import realstatebank from './routes/realstatebank.js';

const app = express();
const port = 3000;
const keepOpenWaitSeconds = 300;

let keepOpenID = false;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/keep-open/:toggle', (req, res) => {
    const toggle = req.params.toggle;

    switch(toggle){
        case '0':
            clearInterval(keepOpenID);
            
            keepOpenID = false;

            console.log('KeepOpen disabled');
            res.send('KeepOpen disabled');
            break;
        case '1':
            if(keepOpenID) clearInterval(keepOpenID);

            keepOpenID = keepOpen(keepOpenWaitSeconds);

            console.log('KeepOpen enabled');
            res.send('KeepOpen enabled');
            break;
        default:
            res.send('Invalid option for KeepOpen');
            break;
    }
});

app.use('/realstatebank', realstatebank)

function keepOpen(timeInSeconds){
    return setInterval(() => {
            console.log('KeepOpen - Execute');
        },
        timeInSeconds * 1000
    );
}

function startServer(){
    app.listen(port, () => {
        keepOpenID = keepOpen(keepOpenWaitSeconds);
        console.log(`KeepOpen enabled with server.`);
        console.log(`Listening on port ${port}`);
    });
}

export {
    startServer
}