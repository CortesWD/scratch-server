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

      const results: Album[] | any[] = response.results
        .map((album: any) => {
          const { id, title, cover_image, genre, formats, country } = album;

          const format: string[] = formats
            .map((f: { name: string }) => f.name)
            .filter((e: string) => e !== null || e !== undefined)

          const isVinyl = !!format.find((e) => e.toLowerCase() === 'vinyl');

          return isVinyl ? {
            id,
            title,
            image: cover_image,
            genre,
            country
          } : null
        })
        .filter((alb: any) => alb !== null);

      return results as Album[];
    },

    album: async (_: any, { input: { id: reqId } }: SearchParams, { dataSources }: Context): Promise<Album> => {

      const response = await dataSources.discogApi.album(reqId);

      const { id, year, styles, title, genres, tracklist, artists: [artist], formats, images, country } = response;

      return {
        id,
        title,
        year: new Date(year),
        genre: genres,
        styles,
        trackList: tracklist,
        artist,
        format: formats,
        image: images[0].uri,
        country
      }
    }
  },

  Album: {
    artist: async (root: Album, __: any, { dataSources }: Context): Promise<Artist> => {
      const { artist } = root;
      const response = await dataSources.discogApi.artist(artist.id);
      const { profile, images: [image] } = response;
      return {
        id: artist.id,
        name: artist.name,
        description: profile,
        image: image.uri,
      }
    }
  },

  Artist: {
    albums: async (root: Artist, __: any, { dataSources }: Context): Promise<Album[]> => {
      const response = await dataSources.discogApi.artistAlbums(root.id);

      const albums: Album[] | any[] = response.releases
        .filter((album) => album.type === 'release')
        .map((album) => {
          const { id, title, thumb, year } = album;

          return {
            id,
            title,
            image: thumb,
            year: new Date(year),
          }
        })
        .sort((a, b) => a.year.getFullYear() - b.year.getFullYear());

      return albums as Album[];
    },
  }

}

export default resolvers;