import Vue from 'vue';
import Vuex from 'vuex';
const createPersistedState = require('vuex-persistedstate');

import * as libplayer from './lib/player';

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
    player: {episode: null, playing: false, timestamp: 0} as Player,
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
      if (!state.episodes[podcast.url]) Vue.set(state.episodes, podcast.url, {});
    },
    updateEpisode(state, {podcast, episode}: {podcast: Podcast, episode: Episode}) {
      const existingEpisode =
        state.episodes[episode.podcastId][episode.guid] || {};

      const updatedEpisode = {
        ...episode,
        duration: episode.duration || existingEpisode.duration,
      };
      Vue.set(state.episodes, podcast.url, state.episodes[podcast.url] || {});
      Vue.set(state.episodes[podcast.url], episode.guid, updatedEpisode);
    },
    clearPlaylist(state) {
      state.playlist = [];
    },

    playEpisode(state, episode) {
      state.player.episode = episode;
      state.player.playing = true;
    },

    togglePlayPause(state) {
      state.player.playing = !state.player.playing;
    },

    updatePlayedTimestamp(state, timestamp: number) {
      state.player.timestamp = timestamp;
    },
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

        context.dispatch('updateEpisodeDurations', podcast);
      } catch (ex) {
        context.commit('updatePodcast', {...podcast, error: ex.message});
        // TODO: This will break bulk updates because it's not caught
        throw ex;
      }
    },

    async updateEpisodeDurations(context, podcast: Podcast) {
      const episodes =
        Object.keys(context.state.episodes[podcast.url]).
        map((episodeId) => context.state.episodes[podcast.url][episodeId]);

      episodes.
      filter((episode) => !episode.duration).
      forEach(async (episode) => {
        episode.duration = await libplayer.fetchDuration(episode);
        context.commit('updateEpisode', {podcast, episode});
      });
    },

    skipToTimestamp(context, newTimestamp: number) {
      console.log('skipping to', newTimestamp);
      context.commit('updatePlayedTimestamp', newTimestamp);
      libplayer.setCurrentTime(newTimestamp);
    },
  }
});

function setPlayerState(player: Player) {
  console.log('Updating player');
  const episode = player.episode;
  const duration = player.episode ? player.episode.duration || 0 : 0;
  libplayer.setSrc(episode ? episode.enclosure.url : null);
  libplayer.setPlaybackRate(1);
  libplayer.setPlayingState(player.playing);
}

store.watch(
  (state) => {
    // Copy all but percent played into a new object
    const {timestamp, ...player} = state.player;
    return player;
  },
  setPlayerState,
  {deep: true}
);

function initializePlayer() {
  const player = store.state.player;

  setPlayerState(player);

  if (player.episode) libplayer.setCurrentTime(player.timestamp || 0);
}
initializePlayer();

export default store;
