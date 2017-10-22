import Vue from 'vue';
import Component from 'vue-class-component';

import {Episode} from '../../lib/types';

import EpisodeView from '../../components/episode/episode';
import AppNav from '../../components/appnav/appnav';

@Component({
  template: require('./playlist.html'),
  props: {
  },
  components: {AppNav, EpisodeView}
})
export default class Playlist extends Vue {
  get podcasts() {
    return this.$store.state.podcasts;
  }

  get episodes() {
    return this.$store.getters.playlist;
  }

  playEpisode(episode: Episode) {
    this.$store.dispatch('playEpisode', episode);
  }
}
