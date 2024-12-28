import { Router } from 'express';
import { Database } from '../../../db/database.js';

const match = Router();
const table = 'match';

match.post('/', async (req, res) => {
    const { playerID } = req.body;

    if (!playerID) {
        return res.status(400).send({ error: 'Todos são obrigatórios!' });
    }

    const created_at = new Date().toISOString();
    const match = new Database();
    const locations = new Database();
    
    await match.openTable(table);
    await locations.openTable('locations');

    const locations_ids = locations.all().map((location) => location.id);

    db.create({
        created_at: created_at,
        players: [
          {
            id: playerID,
            money: 25000,
            locations: [],
            isBanker: true
          }
        ],
        remainingLocations: locations_ids,
        started: false
    });
});

match.post('/enter', async (req, res) => {
    const { playerID, matchID } = req.body;

    if (!playerID || !matchID) {
        return res.status(400).send({ error: 'Todos são obrigatórios!' });
    }

    const db = new Database();
    await db.openTable(table);

    const match = db.one(matchID);

    if(!match.started){
        const playerInMatch = match.players.filter((player) => player.id == playerID);
    
        if(playerInMatch.lenght == 0){
            db.update_one(matchID, {
                players: [
                    ...match.players,
                    {
                        id: playerID,
                        money: 25000,
                        locations: [],
                        isBanker: false
                    }
                ]
            });
        }
        else{
            return res.status(401).send({ error: `O jogador ${playerID}, já está na partida!` });
        }
    }
    else{
        return res.status(400).send({ error: 'A partida já começou, nenhum jogador pode mais entrar' });
    }
});

match.post('/buy-location', async (req, res) => {
    const { playerID, matchID, locationID } = req.body;

    if (!playerID || !matchID || !locationID) {
        return res.status(400).send({ error: 'Todos são obrigatórios!' });
    }

    const matches = new Database();
    await matches.openTable(table);
    
    const match = db.one(matchID);
    
    if(match.started){
        let location_selled = false

        for(let player in match.players){
            if(location_selled) break;

            player_locations = player.locations.filter((location) => location.id == locationID);

            if(player_locations.lenght > 0){
                location_selled = true;
            }
        }

        if(!location_selled){
            const playerIndex = match.players.findIndex(player => player.id == playerID);
            match.players[playerIndex].locations.push({id: locationID, houses: 0});

            matches.update_one(matchID, match);
        }
        else{
            return res.status(400).send({ error: 'Localização já foi comprada' });
        }
    }
});

match.post('/buy-house', async (req, res) => {
    const { playerID, matchID, locationID } = req.body;

    if (!playerID || !matchID || !locationID) {
        return res.status(400).send({ error: 'Todos são obrigatórios!' });
    }

    const matches = new Database();
    await matches.openTable(table);
    
    const match = db.one(matchID);
    
    if(match.started){
        const playerIndex = match.players.findIndex((p) => p.id == playerID);
        const player = match.players[playerIndex];

        if(player){
            const locationIndex = player.locations.findIndex((l) => l.id = locationID);
            
            if(match.players[playerID].locations[locationID].houses < 4){
                match.players[playerID].locations[locationID].houses++;

                matches.update_one(matchID, match);
            }
            else{
                return res.status(400).send({ error: 'Essa localização já atigiu o máximo de casas.' });
            }
        }
        else{
            return res.status(400).send({ error: 'Jogador não encontrado.' });
        }
    }
});

match.post('/transfer-house', async (req, res) => {
    const { sellerID, buyerID, matchID, locationID } = req.body;

    if (!buyerID || !sellerID || !matchID || !locationID) {
        return res.status(400).send({ error: 'Todos são obrigatórios!' });
    }

    const matches = new Database();
    await matches.openTable(table);
    
    const match = db.one(matchID);
    
    if(match.started){
        let sellerID;
        let buyerID;

        match.players.forEach((player, index) => {
            if(player.id == sellerID) sellerID = index;
            if(player.id == buyerID) buyerID = index;
        });

        match.players[sellerID].locations.splice[locationID, 1];
        match.players[buyerID].locations.push({id: locationID, houses: 0});

        matches.update_one(matchID, match);
    }
});

match.get('/', async (_req, res) => {
    const db = new Database();
    await db.openTable(table);

    res.send(db.all());
});

match.get('/:id', async (req, res) => {
    const db = new Database();
    await db.openTable(table);

    res.send(db.one(req.params.id));
});

export default match;