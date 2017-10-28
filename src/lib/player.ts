let currentTrack: HTMLAudioElement = new Audio();

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

function resetAudio(src?: string) {
  // Prevent old and new Audio from playing over each other
  currentTrack.pause();

  /*
  const duration = await fetchDuration(episode);
  Store.commit('updateEpisode', {...episode, duration});
  */

  const track = new Audio(src);
  track.ontimeupdate = () => {
    Store.commit('updatePlayedTimestamp', track.currentTime);
  };
  return track;
}

export function setPlayingState(playing: boolean) {
  if (playing) {
    currentTrack.play();
  } else {
    currentTrack.pause();
  }
}

export function setCurrentTime(timestamp: number) {
  currentTrack.currentTime = timestamp;
}

export function setPlaybackRate(playbackRate: number) {
  currentTrack.playbackRate = playbackRate;
}

export function setSrc(src: string | null) {
  if (!src) {
    currentTrack = resetAudio(undefined);
    return;
  }

  if (currentTrack.currentSrc !== src) {
    currentTrack = resetAudio(src);
  }
}
