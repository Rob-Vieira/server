import { Router } from 'express';
import { Database } from '../../../db/database.js';

const locations = Router();
const table = 'locations';

locations.post('/location', async (req, res) => {
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

locations.get('/locations', async (req, res) => { 
    const db = new Database();
    await db.openTable(table);

    res.send(db.all());
});

locations.get('/location/:id', async (req, res) => {
    const db = new Database();
    await db.openTable(table);

    const item = db.one(req.params.id);

    res.send(item);
});

export default locations;