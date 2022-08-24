/*
 * DataSource
 */
import DiscogAPI from "../datasource/discog-api";

/*
 * Others
 */
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
    albums: async (_: any, { input: { query, page } }: SearchParams, { dataSources }: Context): Promise<Album[]> => {
      const response = await dataSources.discogApi.albums(query, page);

      console.log(response.pagination);
      
      const results: Album[] | any[] = response.results
        .map((album: any) => {
          const { id, title, cover_image, genre, artist, formats, country } = album;

          const format: string[] = formats
            .map((f: { name: string }) => f.name)
            .filter((e: string) => e !== null || e !== undefined)

          const isVinyl = !!format.find((e) => e.toLowerCase() === 'vinyl');
          
          return isVinyl ? {
            id,
            title,
            image: cover_image,
            genre,
            artist,
            country
          } : null
        })
        .filter((alb: any) => alb !== null);

      return results as Album[];
    },

    album: async (_: any, { input: { id: reqId } }: SearchParams, { dataSources }: Context): Promise<Album> => {

      const response = await dataSources.discogApi.album(reqId);

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
    artist: async (root: Album, __: any, { dataSources }: Context): Promise<Artist> => {
      const { id: albumId, } = root;
      const response = await dataSources.discogApi.album(albumId);
      const { artists: [artist] } = response;

      return {
        id: artist.id,
        name: artist.name
      }
    }
  },

}

export default resolvers;