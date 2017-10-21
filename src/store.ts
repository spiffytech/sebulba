import Vue from 'vue';
import Vuex from 'vuex';
const createPersistedState = require('vuex-persistedstate');

import {fetchFeed} from './lib/feedManager';
import {Feed, FeedItem} from './lib/types';

Vue.use(Vuex);

interface PlaylistItem {
  feedId: string;
  episodeId: string;
}

const store = new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    feeds: {} as {[url: string]: Feed},
    items: {} as {[feed: string]: {[guid: string]: FeedItem}},
    playlist: [] as PlaylistItem[],
  },
  getters: {
    playlist(state): FeedItem[] {
      return state.playlist.map((playlistItem) =>
        state.items[playlistItem.feedId][playlistItem.episodeId]
      );
    },
  },
  mutations: {
    addEpisodeToPlaylist(state, feedItem: FeedItem) {
      // TODO: add playlist item in intelligent place
      const playlistItem = {
        feedId: feedItem.feedId,
        episodeId: feedItem.guid,
      };
      if (state.playlist.findIndex((item) =>
        item.feedId === playlistItem.feedId &&
        item.episodeId === playlistItem.episodeId
      ) !== -1) return;

      state.playlist.push(playlistItem);
    },
    updateFeed(state, feed: Feed) {
      Vue.set(state.feeds, feed.url, feed);
    },
    updateFeedItem(state, {feed, feedItem}: {feed: Feed, feedItem: FeedItem}) {
      Vue.set(state.items, feed.url, state.items[feed.url] || {});
      Vue.set(state.items[feed.url], feedItem.guid, feedItem);
    },
    clearPlaylist(state) {
      state.playlist = [];
    }
  },
  actions: {
    async updateFeed(context, feed) {
      context.commit('updateFeed', feed);
      try {
        const {image, items: feedItems} = await fetchFeed(feed);
        context.commit('updateFeed', {...feed, image, error: null});
        feedItems.forEach((feedItem) =>
          context.commit('updateFeedItem', {feed, feedItem})
        );
        feed.error = null;
      } catch (ex) {
        context.commit('updateFeed', {...feed, error: ex.message});
      }
    }
  }
});
export default store;
