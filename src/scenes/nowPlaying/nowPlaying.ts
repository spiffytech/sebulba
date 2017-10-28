import Vue from 'vue';
import Component from 'vue-class-component';

import {Episode, Podcast} from '../../lib/types';
import AppNav from '../../components/appnav/appnav';
import Slider from './components/slider/slider';

@Component({
  template: require('./nowPlaying.html'),
  props: {
  },
  components: {AppNav, Slider},
})
export default class NowPlaying extends Vue {
  get cardStyleObject() {
    if (!this.podcast) return 'url()';
    return {backgroundImage: `url("${this.podcast.image}")`};
  }

  get duration(): string | null {
    const toTimestamp = (n: number) => new Date(n * 1000).toISOString().substr(11, 8);
    const duration = this.$store.state.player.episode.duration;
    if (!duration) return 'unknown duration';
    return toTimestamp(duration);
  }

  get episode(): Episode {
    return this.$store.state.player.episode;
  }

  get podcast(): Podcast | null {
    if (!this.episode) return null;
    return this.$store.state.podcasts[this.episode.podcastId];
  }

  get sliderValue(): number {
    return this.$store.state.player.timestamp;
  }
  get sliderMin(): number {
    return 0;
  }
  get sliderMax(): number {
    const episode = this.$store.state.player.episode;
    return episode ? (episode.duration || 0) : 0;
  }

  onSlideInput(newTimestamp: number) {
    this.$store.commit('updatePlayedTimestamp', newTimestamp);
  }

  onSlideChange(newTimestamp: number) {
    this.$store.dispatch('skipToTimestamp', newTimestamp);
  }
}
