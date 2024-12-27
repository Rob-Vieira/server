import { Router } from 'express';
import { Database } from '../../../db/database.js';

const player = Router();
const table = 'player';

player.post('/', async (req, res) => {
    const { name, money, locations } = req.body;

    if (!name || !money || !locations) {
        return res.status(400).send({ error: 'Todos são obrigatórios!' });
    }

    const db = new Database();
    await db.openTable('player');

    const id = await db.create({
        name,
        money,
        locations,
    })

    res.status(201).send({ id });
});

player.get('/', async (req, res) => { 
    const db = new Database();
    await db.openTable('player');

    res.send(db.all());
});

player.get('/:id', async (req, res) => {
    const db = new Database();
    await db.openTable(table);

    const item = db.one(req.params.id);

    res.send(item);
});

export default player;