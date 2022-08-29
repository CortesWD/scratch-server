
export interface Album {
  id: number;
  title: string;
  image: string;
  artist: Artist;
  year?: Date;
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
  albums?: Album[];
  description?: string;
}

export interface TrackList {
  title: string;
  duration: string;
  position: string;
}

export type AssetType = 'release' | 'master' | 'artist';