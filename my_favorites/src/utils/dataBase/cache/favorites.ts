import { FavoriteType } from "../../types/favorite";
import { ALL_FAVORITES } from "../querys/favorites";
import { ApolloCache } from "@apollo/client";

type cacheType = ApolloCache<unknown>;

type modifyFavorite = {
	modifyFavorite: { oldName: string; newFavorite: FavoriteType };
};
type deleteFavorite = { deleteFavorite: FavoriteType };
type createFavorite = { createFavorite: FavoriteType };
type deleteAllFavorites = { deleteAllFavorites: { list: string; deletedCount: number } };

export const CACHE_deleteAllFavorites = {
	update(cache: cacheType, { data }: { data: deleteAllFavorites }) {
		const listName = data.deleteAllFavorites.list;
		const favoritesOnCache = cache.readQuery({ query: ALL_FAVORITES }) as {
			favorites: FavoriteType[];
		};
		const favorites = [...favoritesOnCache.favorites];
		const newFavorites = favorites.filter((favorite) => favorite.list != listName);

		cache.writeQuery({
			query: ALL_FAVORITES,
			data: { favorites: newFavorites },
		});
	},
};

export const CACHE_modifyFavorite = {
	update(cache: cacheType, { data }: { data: modifyFavorite }) {
		const newFavorite = data.modifyFavorite.newFavorite;
		const favoritesOnCache = cache.readQuery({ query: ALL_FAVORITES }) as {
			favorites: FavoriteType[];
		};
		const favorites = [...favoritesOnCache.favorites];
		const oldFavoriteIndex = favorites.findIndex(
			(favorite) => favorite.name === data.modifyFavorite.oldName
		);

		favorites[oldFavoriteIndex] = newFavorite;

		cache.writeQuery({
			query: ALL_FAVORITES,
			data: { favorites },
		});
	},
};

export const CACHE_deleteFavorite = {
	update(cache: cacheType, { data }: { data: deleteFavorite }) {
		const name = data.deleteFavorite.name;
		const favoritesOnCache = cache.readQuery({ query: ALL_FAVORITES }) as {
			favorites: FavoriteType[];
		};
		const favorites = favoritesOnCache.favorites.filter((favorite) => favorite.name != name);

		cache.writeQuery({
			query: ALL_FAVORITES,
			data: { favorites },
		});
	},
};

export const CACHE_createFavorite = {
	update(cache: cacheType, { data }: { data: createFavorite }) {
		const newFavorite = [data?.createFavorite];
		const favoritesOnCache = cache.readQuery({ query: ALL_FAVORITES }) as {
			favorites: FavoriteType[];
		};
		const favorites = [...favoritesOnCache.favorites, ...newFavorite];

		cache.writeQuery({
			query: ALL_FAVORITES,
			data: { favorites },
		});
	},
};
