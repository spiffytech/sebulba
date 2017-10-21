import Vue from 'vue';
import Component from 'vue-class-component';

import {Feed, FeedItem} from '../../lib/types';

@Component({
  template: require('./episode.html'),
  props: {
    feed: Object,
    feedItem: Object,
  }
})
export default class Episode extends Vue {
  feed: Feed;
  feedItem: FeedItem;

  addToPlaylist() {
    this.$store.commit('addEpisodeToPlaylist', this.feedItem);
  }
}
