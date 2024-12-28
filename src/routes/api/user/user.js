import { Router } from 'express';
import { Database } from '../../../db/database.js';

const players = Router();
const table = 'players';

players.post('/player', async (req, res) => {
    const { name, money, locations } = req.body;

    if (!name || !money || !locations) {
        return res.status(400).send({ error: 'Todos são obrigatórios!' });
    }

    const db = new Database();
    await db.openTable('players');

    const id = await db.create({
        name,
        money,
        locations,
    })

    res.status(201).send({ id });
});

players.get('/players', async (req, res) => { 
    const db = new Database();
    await db.openTable('players');

    res.send(db.all());
});

players.get('/player/:id', async (req, res) => {
    const db = new Database();
    await db.openTable(table);

    const item = db.one(req.params.id);

    res.send(item);
});

export default players;