import Vue from 'vue';
import Component from 'vue-class-component';

import {Feed, FeedItem} from '../../lib/types';

@Component({
  template: require('./index.html'),
  props: {
    feed: Object,
    feedItem: Object,
  }
})
export default class Podcast extends Vue {
  feed: Feed;
  feedItem: FeedItem;

  addToPlaylist() {
    this.$store.commit('addEpisodeToPlaylist', this.feedItem);
  }
}
