import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import {fetchFeed} from './lib/feedManager';
import {Feed, FeedItem} from './lib/types';

Vue.use(Vuex);

/*
function filterLinkedList(list: Playlist, filter: (item: PlaylistItem) => boolean) {
  const iter = (acc: PlaylistItem[], item: PlaylistItem): PlaylistItem[] => {
    if (filter(item)) acc.push(item);
    if (item.child === null) return acc;
    return iter(acc, list.children[item.child]);
  };

  if (list.root === null) return [];
  return iter([], list.root);
}

function findLastByFeed(playlist: Playlist, feed: string) {
  const itemsInFeed = filterLinkedList(playlist, (item) => item.feedId === feed);
  return itemsInFeed[itemsInFeed.length - 1];
}
*/

const store = new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    feeds: {} as {[url: string]: Feed},
    items: {} as {[feed: string]: {[guid: string]: FeedItem}},
    playlist: [] as string[],
  },
  getters: {
    /*
    feedItems(state): return {[feed: string]: FeedItem[]} {
    }
    */
  },
  mutations: {
    addEpisodeToPlaylist(state, feedItem: FeedItem) {
      // TODO: add playlist item in intelligent place
      const id = feedItem.feedId + feedItem.guid;
      if (state.playlist.indexOf(id) !== -1) return;
      state.playlist.push(id);
    },
    updateFeed(state, feed: Feed) {
      Vue.set(state.feeds, feed.url, feed);
    },
    updateFeedItem(state, {feed, feedItem}: {feed: Feed, feedItem: FeedItem}) {
      Vue.set(state.items, feed.url, state.items[feed.url] || {});
      Vue.set(state.items[feed.url], feedItem.guid, feedItem);
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
