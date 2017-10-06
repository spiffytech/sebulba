import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import {fetchFeed} from './lib/feedManager';
import {Feed, FeedItem} from './lib/types';

Vue.use(Vuex);

const store = new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    feeds: {} as {[url: string]: Feed},
    items: {} as {[feed: string]: {[guid: string]: FeedItem}},
  },
  getters: {
    /*
    feedItems(state): return {[feed: string]: FeedItem[]} {
    }
    */
  },
  mutations: {
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
        const feedItems = await fetchFeed(feed);
        feedItems.forEach((feedItem) =>
          context.commit('updateFeedItem', {feed, feedItem})
        );
        feed.error = null;
        context.commit('updateFeed', feed);
      } catch (ex) {
        feed.error = ex.message;
        context.commit('updateFeed', feed);
      }
    }
  }
});
export default store;
