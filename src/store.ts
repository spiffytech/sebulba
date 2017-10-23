import Vue from 'vue';
import Vuex from 'vuex';
const createPersistedState = require('vuex-persistedstate');

import * as player from './lib/player';

import {fetchPodcast} from './lib/feedManager';
    import {Episode, Player, Podcast} from './lib/types';

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
    player: {episode: null, playing: false} as Player,
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
    },

    playEpisode(state, episode) {
      state.player.episode = episode;
      state.player.playing = true;
    },

    setEpisodeDuration(state, {episode, duration}) {
      console.log(duration);
      state.episodes[episode.podcastId][episode.guid].duration = duration;
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
    },

    playEpisode(context, episode) {
      context.commit('playEpisode', episode);
      player.playEpisode(episode, store);
    }
  }
});
export default store;
