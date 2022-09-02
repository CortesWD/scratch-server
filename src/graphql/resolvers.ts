/*
 * DataSource
 */
import DiscogAPI from "../datasource/discog-api";

/*
 * Others
 */
import { iAlbum, Artist, AssetType, UserCollection } from "../models/music.js";
import { iUser, User } from "../models/user.js";

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
    albums: async (_: any, { input: { query, page } }: SearchParams, { dataSources }: Context): Promise<iAlbum[]> => {
      const response = await dataSources.discogApi.albums(query, page);

      const results: iAlbum[] | any[] = response.results
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

      return results as iAlbum[];
    },

    album: async (_: any, { input: { id: reqId } }: SearchParams, { dataSources }: Context): Promise<iAlbum> => {

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

  Mutation: {
    addToCollection: async (_: any, { input }: any): Promise<iUser | Error> => {
      const {
        id,
        title,
        image,
      } = input;
      try {
        const newItem = new UserCollection({
          title,
          image,
          albumId: id
        });

        const user = await User.findById('630fbb7cb4cc759e82872261');

        if (!user) { return new Error('user not found') };

        const savedItem = await newItem.save();

        user?.collections?.push(savedItem);

        await user?.save();

        console.warn(user);

        return {
          id: user._id,
          collections: user?.collections?.map(el => ({ id: el?._id?.toString() }))
        } as iUser

      } catch (error) {
        console.log(error);
        return error as Error;
      }
    }
  },

  Album: {
    artist: async (root: iAlbum, __: any, { dataSources }: Context): Promise<Artist> => {
      const { artist } = root;
      const response = await dataSources.discogApi.artist(artist?.id ?? 0);
      const { profile, images: [image] } = response;
      return {
        id: artist?.id ?? 0,
        name: artist?.name ?? 'NN',
        description: profile,
        image: image.uri,
      }
    }
  },

  Artist: {
    albums: async (root: Artist, __: any, { dataSources }: Context): Promise<iAlbum[]> => {
      const response = await dataSources.discogApi.artistAlbums(root.id);

      const albums: iAlbum[] | any[] = response.releases
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

      return albums as iAlbum[];
    },
  }

}

export default resolvers;