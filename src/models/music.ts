import mongoose from "mongoose";

const { Schema, model } = mongoose;
export interface iAlbum {
  id: number;
  title: string;
  image: string;
  year?: Date;
  artist?: Artist;
  genre?: string[];
  owned?: boolean;
  format?: string[];
  trackList?: TrackList[];
  country?: string;
  styles?: string[];
}

export interface Artist {
  id: number;
  name: string;
  image: string;
  albums?: iAlbum[];
  description?: string;
}

export interface TrackList {
  title: string;
  duration: string;
  position: string;
}

export type AssetType = 'release' | 'master' | 'artist';

export interface iUserCollection extends mongoose.Document<any, any, iAlbum> {
  labels?: string[],
  albumId: number,
  userId: mongoose.Types.ObjectId
}

const collectionsSchema = new Schema({
  labels: [{ type: String }],
  title: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  albumId: {
    type: Number,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
});

export const UserCollection = model<iUserCollection>('UserCollection', collectionsSchema);