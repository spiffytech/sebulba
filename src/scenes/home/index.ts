import Vue from 'vue';
import Component from 'vue-class-component';

import {parseOpml} from '../../lib/feedManager';
import store from '../../store';

@Component({
  template: require('./index.html')
})
export default class Home extends Vue {
  get feeds() {
    return this.$store.state.feeds;
  }
  get items() {
    return this.$store.state.items;
  }

  fileSelected(e) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const opmlText = (event.target as any).result;
      const feeds = parseOpml(opmlText);
      feeds.forEach((feed) => store.dispatch('updateFeed', feed));
    };
    reader.readAsText(e.target.files[0]);
  }
}
