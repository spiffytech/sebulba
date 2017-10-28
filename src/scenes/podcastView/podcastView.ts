import Vue from 'vue';
import Component from 'vue-class-component';

import EpisodeView from '../../components/episode/episode';
import AppNav from '../../components/appnav/appnav';

import {Episode} from '../../lib/types';

@Component({
  template: require('./podcastView.html'),
  props: {
    id: String,
  },
  components: {AppNav, EpisodeView},
})
export default class PodcastView extends Vue {
  id: string;

  get podcast() {
    return this.$store.state.podcasts[this.id];
  }

  get episodes() {
    return this.$store.state.episodes[this.id];
  }

  addToPlaylist(episode: Episode) {
    this.$store.commit('addEpisodeToPlaylist', episode);
  }

  refresh() {
    this.$store.dispatch('updatePodcast', this.$store.state.podcasts[this.id]);
  }
}
