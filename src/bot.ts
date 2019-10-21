import MayushiiClient from './client/MayushiiClient';
import dotenv from 'dotenv';

dotenv.config();

const client = new MayushiiClient({ owner: process.env.OWNER, token: process.env.TOKEN, uri: process.env.MONGO_URI });
client.start();
