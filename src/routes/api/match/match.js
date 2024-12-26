import { Router } from 'express';
import { Database } from '../../../db/database.js';
import players from '../players/players.js';

const match = Router();
const table = 'match';

match.post('/match', async (req, res) => {
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

match.post('/match/enter', async (req, res) => {
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

match.post('/match/location', async (req, res) => {
    const { playerID, matchID, locationID } = req.body;

    if (!playerID || !matchID || !locationID) {
        return res.status(400).send({ error: 'Todos são obrigatórios!' });
    }

    const matches = new Database();
    await matches.openTable(table);
    
    const match = db.one(matchID);
    
    if(match.started){
        const locations = new Database();
        await locations.openTable('locations');

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

        }
    }
});

match.get('/matches', async (_req, res) => {
    const db = new Database();
    await db.openTable(table);

    res.send(db.all());
});

match.get('/match/:id', async (req, res) => {
    const db = new Database();
    await db.openTable(table);

    res.send(db.one(req.params.id));
});

export default match;