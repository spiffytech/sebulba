import Vue from 'vue';
import Component from 'vue-class-component';

import {parseOpml} from '../../lib/feedManager';
import Podcasts from './components/podcasts';
import store from '../../store';

@Component({
  template: require('./index.html'),
  components: {Podcasts}
})
export default class Home extends Vue {
  get feeds() {
    return this.$store.state.feeds;
  }
  get items() {
    return this.$store.state.items;
  }

  refresh() {
    Object.keys(this.$store.state.feeds).forEach((feed_url) =>
      store.dispatch('updateFeed', this.$store.state.feeds[feed_url])
    );
  }

  fileSelected(e: any) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const opmlText = (event.target as any).result;
      const feeds = parseOpml(opmlText);
      feeds.forEach((feed) => store.dispatch('updateFeed', feed));
    };
    reader.readAsText(e.target.files[0]);
  }
}
