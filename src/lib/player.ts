let currentTrack: HTMLAudioElement | null = null;

import {Episode} from './types';
import Store from '../store';

/**
 * Preloads the episode mp3 just enough to get its length and bitrate, then
 * provides the number of seconds the track lasts
 */
export function fetchDuration(episode: Episode): Promise<number> {
  const track = new Audio(episode.enclosure.url);
  track.preload = 'metadata';
  return new Promise((resolve) => {
    track.onloadedmetadata = (ev: Event) => {
      resolve(track.duration);
    };
  });
}

export async function playEpisode(episode: Episode, store: typeof Store) {
  const track = new Audio(episode.enclosure.url);
  const duration = await fetchDuration(episode);
  store.commit('updateEpisode', {...episode, duration});

  currentTrack = track;
}

export function setState(
  {src, playing, playbackRate}:
  { src: string | null; playing: boolean; playbackRate: number; }
) {
  if (!src) {
    currentTrack = null;
    return;
  }

  if (!currentTrack || currentTrack.currentSrc !== src) {
    currentTrack = new Audio(src);
  }

  if (playing) {
    currentTrack.pause();
  } else {
    currentTrack.play();
  }

  currentTrack.playbackRate = playbackRate;
}
