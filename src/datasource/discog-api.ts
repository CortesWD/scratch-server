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

  resultAlbums(q: string, page: string = "1"): Promise<SearchResults> {
    return this.get(`/database/search`, { q, page });
  }

  album(id: number = 1, type: AssetType): Promise<DiscogMaster> {
    return this.get(`/${type}s/${id}`)
  }

}

export default DiscogAPI;