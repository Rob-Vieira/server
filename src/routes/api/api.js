import { Router } from 'express';
import user from './user/user.js';
import match from './match/match.js';
import location from './location/location.js';

const api = Router();

api.use('/user', user);
api.use('/location', location);
api.use('/match', match);

export default api;