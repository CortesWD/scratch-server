import mongoose from "mongoose";
import { iAlbum, iUserCollection } from "./music";

const { Schema, model, Document: MongoDoc } = mongoose;

export interface iUser extends mongoose.Document {
  email: string;
  password: string;
  collections?: iUserCollection[];
  wishlists?: iUserCollection[];
}

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
  },
  collections: [{
    type: Schema.Types.ObjectId,
    ref: 'UserCollection'
  }],
  wishlists: [{
    type: Schema.Types.ObjectId,
    ref: 'UserCollection'
  }],
});

export const User = model<iUser>('User', userSchema);