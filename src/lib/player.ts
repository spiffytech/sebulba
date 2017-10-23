let currentTrack: HTMLAudioElement | null = null;

import {Episode} from './types';
import Store from '../store';

export function playEpisode(episode: Episode, store: typeof Store) {
  const track = new Audio(episode.enclosure.url);
  track.preload = 'metadata';
  track.onloadedmetadata = (ev: Event) => {
    store.commit('setEpisodeDuration', {episode, duration: track.duration});
  };

  currentTrack = track;
}
