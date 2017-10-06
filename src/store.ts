import Vue from 'vue';
import Vuex from 'vuex';

import {Feed} from './lib/types';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    feeds: {} as {[url: string]: Feed}
  },
  mutations: {
    updateFeed(state, feed: Feed) {
      Vue.set(state.feeds, feed.url, feed);
    }
  },
  actions: {
    updateFeed(context, feed) {
      context.commit('updateFeed', feed);
    }
  }
});
export default store;
