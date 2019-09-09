import { ConnectionManager } from 'typeorm';
import { Setting } from '../models/Settings';

const connectionManager = new ConnectionManager();
connectionManager.create({
	name: 'Mayushii',
	type: 'mongodb',
	url: process.env.DB,
	entities: [Setting]
});

export default connectionManager;