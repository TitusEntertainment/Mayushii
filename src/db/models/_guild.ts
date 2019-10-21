import { Document, Model, model, Schema } from 'mongoose';
import timestamp = require('mongoose-timestamp');

export interface IGuild extends Document {
  _id: string;
  name: string;
  prefix?: string;
}

const GuildSchema: Schema = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  prefix: { type: String, default: '.' },
});
GuildSchema.plugin(timestamp);

export default model<IGuild>('Guild', GuildSchema);
