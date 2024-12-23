import { Router } from 'express';
import { Database } from '../db/database.js';

const realstatebank = Router();
const dbfile = './src/db/db.json';

realstatebank.post('/banker', (req, res) => {

});

realstatebank.post('/players', (req, res) => {

});

realstatebank.get('/players', async (req, res) => {
    const data = {
        players: null,
        matches: null,
        locations: null,
    }; 
    
    const db = new Database();
    await db.openTable('players');
    
    data.players = db.all();
    
    await db.openTable('matches');
    
    data.matches = db.all();
    
    await db.openTable('locations');

    data.locations = db.all();

    res.send(data.players[0].name);
});

realstatebank.get('/player', (req, res) => {

});

export default realstatebank;