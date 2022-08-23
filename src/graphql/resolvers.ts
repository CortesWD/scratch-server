import DiscogAPI from "../datasource/discog-api";
import { Album, Artist, AssetType } from "../models/music";

interface SearchParams {
  input: {
    query: string,
    page?: string
    type: AssetType
    id: number
  }
}

interface Context {
  dataSources: {
    discogApi: DiscogAPI
  }
}

const resolvers = {
  Query: {
    resultAlbums: async (_: any, { input: { query, page } }: SearchParams, { dataSources }: Context): Promise<Album[]> => {
      const response = await dataSources.discogApi.resultAlbums(query, page);

      const results: Album[] = response.results
        .filter((item: { type: AssetType }) => (item.type.toLowerCase() === 'release') || (item.type.toLowerCase() === 'master'))
        .map((album: any) => {
          const { id, title, cover_image, genre } = album;
          return {
            id,
            title,
            image: cover_image,
            genre
          }
        });

      return results;
    },

    album: async (_: any, { input: { id: reqId, type } }: SearchParams, { dataSources }: Context): Promise<Album> => {

      const response = await dataSources.discogApi.album(reqId, type);

      const { id, year, title, genres, tracklist, artists: [artist], formats, images } = response;
      return {
        id,
        title,
        year,
        genre: genres,
        trackList: tracklist,
        artist, 
        format: formats,
        image: images[0].uri
      }
    }
  },

  Album: {
    Artist: async (_: any, { input: { id: reqId, type } }: SearchParams, { dataSources }: Context): Promise<Artist> => {

      return {
        id: 123,
        name: "string",
        albums: []
      }
    }
  }, 

  Artist: {
    Album: {}
  }
}

export default resolvers;