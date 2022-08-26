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
  pagination: {
    pages: number;
    page: number;
    items: number;
  }
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
  released: number;
  tracklist: any[];
  artists: any[];
  title: string;
  data_quality: string;
  videos: any[];
  formats?: any[];
  country?: string
}

export interface DiscogArtist {
  name: string;
  id: number;
  resource_url: string;
  uri: string;
  releases_url: string;
  images: DiscogImage[];
  profile: string;
  urls: string[];
  namevariations: string[];
  members: DiscogMember[];
  data_quality: string;
}

export interface DiscogImage {
  uri: string;
  resource_url: string;
  uri150: string;
  width: number;
  height: number;
}
export interface DiscogMember {
  id: number;
  name: string;
  resource_url: string;
  active: boolean;
}

export interface DiscogArtistReleases {
  pagination: DiscogPagination;
  releases: DiscogArtistRelease[];
}
export interface DiscogPagination {
  page: number;
  pages: number;
  per_page: number;
  items: number;
}

export interface DiscogArtistRelease {
  id: number;
  title: string;
  main_release?: number;
  artist: DiscogArtist;
  resource_url: string;
  year: number;
  thumb: string;
  format?: string;
  type: AssetType;
}