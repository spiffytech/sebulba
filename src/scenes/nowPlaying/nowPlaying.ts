import Vue from 'vue';
import Component from 'vue-class-component';

import {Episode, Podcast} from '../../lib/types';
import AppNav from '../../components/appnav/appnav';

@Component({
  template: require('./nowPlaying.html'),
  props: {
  },
  components: {AppNav},
})
export default class NowPlaying extends Vue {
  get cardStyleObject() {
    if (!this.podcast) return 'url()';
    return {backgroundImage: `url("${this.podcast.image}")`};
  }

  get episode(): Episode {
    return this.$store.state.player.episode;
  }

  get podcast(): Podcast | null {
    if (!this.episode) return null;
    return this.$store.state.podcasts[this.episode.podcastId];
  }
}
