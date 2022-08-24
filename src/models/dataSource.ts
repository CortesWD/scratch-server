import { AssetType } from "./music"

export interface DiscogRes {
  id: number;
  type: AssetType;
  title: string;
  cover_image: string;
  genre: string[];
}

export interface SearchResults {
  results: DiscogRes[];
}

export interface DiscogMaster {
  id: number;
  main_release: number;
  most_recent_release: number;
  resource_url: string;
  uri: string;
  versions_url: string;
  main_release_url: string;
  most_recent_release_url: string;
  num_for_sale: number;
  lowest_price: number;
  images: any[];
  genres: any[];
  styles: any[];
  year: number;
  tracklist: any[];
  artists: any[];
  title: string;
  data_quality: string;
  videos: any[];
  formats?: any[];
}