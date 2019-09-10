import 'reflect-metadata';
import MayushiiClient from './client/MayushiiClient';
require('dotenv').config();
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { GuildModel } from './db/models/Guild.Model';

const isProd = process.env.NODE_ENV === 'production';
const client = new MayushiiClient({ owner: process.env.OWNER, token: process.env.TOKEN });
async () => {
  await createConnection({
    type: 'mongodb',
    host: 'localhost',
    port: 27017,
    database: 'Mayushii',
    useNewUrlParser: true,
    synchronize: !isProd,
    logging: !isProd,
    entities: [GuildModel],
  });
  console.log('Connected to db');
  client.start();
};
