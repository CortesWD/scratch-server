/*
 * Dependencies
 */
import { RESTDataSource, RequestOptions } from "apollo-datasource-rest";

/*
 * Models
 */
import { DiscogArtist, DiscogArtistReleases, DiscogMaster, SearchResults } from "../models/dataSource";

const DISCOG_URL = 'https://api.discogs.com';

class DiscogAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = DISCOG_URL;
  }

  willSendRequest(request: RequestOptions) {
    request.headers.set('Authorization', `Discogs key=${process.env.KEY}, secret=${process.env.SECRET}`)
  }

  albums(q: string, page: string = "1"): Promise<SearchResults> {
    return this.get(`/database/search`, { q, page, type: 'release' });
  }

  album(id: number = 1): Promise<DiscogMaster> {
    return this.get(`/releases/${id}`)
  }

  artist(id: number): Promise<DiscogArtist> {
    return this.get(`/artists/${id}`);
  }

  artistAlbums(id: number): Promise<DiscogArtistReleases> {
    return this.get(`/artists/${id}/releases`, {
      format: 'vinyl'
    });
  }

}

export default DiscogAPI;