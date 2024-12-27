import { Router } from 'express';
import player from './player/player.js';
import match from './match/match.js';
import location from './location/location.js';

const api = Router();

api.use('/player', player);
api.use('/location', location);
api.use('/match', match);

export default api;