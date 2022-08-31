import mongoose from "mongoose";

const { Schema, model } = mongoose;

export interface iUser {
  email: string;
  password: string;
  collections?: any[];
  wishlists?: any[];
}

const userSchema = new Schema<iUser>({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
  }, 
  collections: [{
    album: {
      type: Object
    }
  }],
  wishlists: [{
    list: {
      type: Object
    }
  }],
});

export const User = model<iUser>('User', userSchema);