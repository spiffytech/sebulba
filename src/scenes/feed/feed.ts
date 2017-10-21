import Vue from 'vue';
import Component from 'vue-class-component';

import Episode from '../../components/episode/episode';

import {FeedItem} from '../../lib/types';

@Component({
  template: require('./feed.html'),
  props: {
    id: String,
  },
  components: {Episode},
})
export default class Feed extends Vue {
  id: string;

  get feed() {
    return this.$store.state.feeds[this.id];
  }

  get items() {
    return this.$store.state.items[this.id];
  }

  addToPlaylist(feedItem: FeedItem) {
    this.$store.commit('addEpisodeToPlaylist', feedItem);
  }
}
