/*
 * Dependencies
 */
import { RESTDataSource, RequestOptions } from "apollo-datasource-rest";

/*
 * Models
 */
import { DiscogMaster, SearchResults } from "../models/dataSource";
import { AssetType } from "../models/music";

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

}

export default DiscogAPI;