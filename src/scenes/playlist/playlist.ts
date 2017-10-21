import Vue from 'vue';
import Component from 'vue-class-component';

import Episode from '../../components/episode/episode';
import AppNav from '../../components/appnav/appnav';

@Component({
  template: require('./playlist.html'),
  props: {
  },
  components: {AppNav, Episode}
})
export default class Playlist extends Vue {
  get feeds() {
    return this.$store.state.feeds;
  }

  get episodes() {
    return this.$store.getters.playlist;
  }
}
