import Vue from 'vue';
import Component from 'vue-class-component';

import {parseOpml} from '../../lib/feedManager';
import store from '../../store';

@Component({
  template: require('./index.html')
})
export default class Home extends Vue {
  get path() {
    return this.$store.state;
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
