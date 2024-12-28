/**
 * 
 * MATCH MODEL
 * 
 * id: number;
 * created_at: string;
 * remainingLocations: number[];  
 * started: boolean;
 * banker: number;
 * startBalance: number;
 * players: player[];
 * 
 * PLAYER MODEL
 * 
 * id: number;
 * money: number;
 * locations: location[];
 * 
 * LOCATION MODEL
 * 
 * id: number;
 * houses: number;
 * 
**/

import { Router } from 'express';
import { Database } from '../../../db/database.js';

const match = Router();
const table = 'match';

match.post('/', async (req, res) => {
    const { userID, startBalance = 25000 } = req.body;

    if (!userID) {
        return res.status(400).send({ error: 'Todos são obrigatórios!' });
    }

    const match = new Database();
    const locations = new Database();
    
    await match.openTable(table);
    await locations.openTable('location');
    
    const locations_ids = locations.all().map((location) => location.id);
    const created_at = new Date().toISOString();

    match.create({
        created_at: created_at,
        remainingLocations: locations_ids,
        started: false,
        banker: userID,
        startBalance: startBalance,
        players: [
          {
            id: userID,
            money: startBalance,
            locations: [],
          }
        ],
    });
});

match.post('/join', async (req, res) => {
    const { userID, matchID } = req.body;

    if (!userID || !matchID) {
        return res.status(400).send({ error: 'Todos são obrigatórios!' });
    }

    const db = new Database();
    await db.openTable(table);

    const match = db.one(matchID);

    if(!match.started){
        const playerInMatch = match.players.filter((player) => player.id == userID);
    
        console.log(playerInMatch.length);

        if(playerInMatch.length == 0){
            db.update_one(matchID, {
                players: [
                    ...match.players,
                    {
                        id: userID,
                        money: match.startBalance,
                        locations: []
                    }
                ]
            });
        }
        else{
            return res.status(401).send({ error: `O jogador ${userID}, já está na partida!` });
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

    const match = matches.one(matchID);
    
    if(match.started){
        const remainingIndex = match.remainingLocations.findIndex((id) => id == locationID);

        if(remainingIndex > -1){
            const locations = new Database();
            await locations.openTable('location');

            const location = locations.one(locationID);
            const playerIndex = match.players.findIndex(player => player.id == playerID);
            const player = match.players[playerIndex];
            
            if((player.money - location.price) >= 1){
                player.locations.push({id: locationID, houses: 0});
                player.money -= location.price;
                match.remainingLocations.splice(remainingIndex, 1);
                matches.update_one(matchID, match);
                return res.status(200).send({ error: 'Compra realizada.' });
            }
            else{
                return res.status(400).send({ error: 'Jogador não possuí saldo suficiente para realizar a compra.' });
            }
        }
        else{
            return res.status(400).send({ error: 'Localização já foi comprada' });
        }
    }
    else{
        return res.status(400).send({ error: 'A partida ainda foi iniciada.' });
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