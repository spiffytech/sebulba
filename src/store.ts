import Vue from 'vue';
import Vuex from 'vuex';
const createPersistedState = require('vuex-persistedstate');

import {fetchPodcast} from './lib/feedManager';
import {Podcast, Episode} from './lib/types';

Vue.use(Vuex);

interface PlaylistItem {
  podcastId: string;
  episodeId: string;
}

const store = new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    podcasts: {} as {[url: string]: Podcast},
    episodes: {} as {[podcastId: string]: {[guid: string]: Episode}},
    playlist: [] as PlaylistItem[],
  },
  getters: {
    playlist(state): Episode[] {
      return state.playlist.map((playlistItem) =>
        state.episodes[playlistItem.podcastId][playlistItem.episodeId]
      );
    },
  },
  mutations: {
    addEpisodeToPlaylist(state, episode: Episode) {
      // TODO: add playlist item in intelligent place
      const playlistItem = {
        podcastId: episode.podcastId,
        episodeId: episode.guid,
      };
      if (state.playlist.findIndex((item) =>
        item.podcastId === playlistItem.podcastId &&
        item.episodeId === playlistItem.episodeId
      ) !== -1) return;

      state.playlist.push(playlistItem);
    },
    updatePodcast(state, podcast: Podcast) {
      Vue.set(state.podcasts, podcast.url, podcast);
    },
    updateEpisode(state, {podcast, episode}: {podcast: Podcast, episode: Episode}) {
      Vue.set(state.episodes, podcast.url, state.episodes[podcast.url] || {});
      Vue.set(state.episodes[podcast.url], episode.guid, episode);
    },
    clearPlaylist(state) {
      state.playlist = [];
    }
  },
  actions: {
    async updatePodcast(context, podcast) {
      context.commit('updatePodcast', podcast);
      try {
        const {image, episodes} = await fetchPodcast(podcast);
        context.commit('updatePodcast', {...podcast, image, error: null});
        episodes.forEach((episode) =>
          context.commit('updateEpisode', {podcast, episode})
        );
        podcast.error = null;
      } catch (ex) {
        context.commit('updatePodcast', {...podcast, error: ex.message});
      }
    }
  }
});
export default store;
