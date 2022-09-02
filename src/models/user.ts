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

userSchema.methods.addToCollection = function (collection: iUserCollection) {

  const id = collection._id.toString();
  const collections = [...this.collections];
  const idExists = !!collections.find(({ _id }) => _id.toString() === id);
  // Add only if doesn't exists
  if (idExists) return this;

  collections.push(collection);

  this.collections = collections;

  return this.save();
}

userSchema.methods.removeFromCollection = function (albumId: string) {

  const collections = this.collections.filter((item: iUserCollection) => item.albumId.toString() !== albumId);

  this.collections = collections;

  return this.save();
}

export const User = model<iUser>('User', userSchema);