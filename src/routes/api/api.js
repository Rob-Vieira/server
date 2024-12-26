import { Router } from 'express';
import players from './players/players.js';
import match from './match/match.js';
import locations from './locations/locations.js';

const api = Router();

api.use('/', players);
api.use('/', locations);
api.use('/', match);

export default api;