import { Router } from 'express';
import { Database } from '../../../db/database.js';

const location = Router();
const table = 'location';

location.post('/', async (req, res) => {
    const { name, price, rent, type, group } = req.body;

    if (!name || !price || !rent || !type || !group) {
        return res.status(400).send({ error: 'Todos são obrigatórios!' });
    }

    const db = new Database();
    await db.openTable(table);

    const id = await db.create({
        name,
        price,
        rent,
        type,
        group
    })

    res.status(201).send({ id });
});

location.get('/', async (req, res) => { 
    const db = new Database();
    await db.openTable(table);

    res.send(db.all());
});

location.get('/:id', async (req, res) => {
    const db = new Database();
    await db.openTable(table);

    const item = db.one(req.params.id);

    res.send(item);
});

export default location;
