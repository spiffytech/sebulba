import Vue from 'vue';
import Component from 'vue-class-component';

import {parseOpml} from '../../lib/feedManager';

@Component({
  template: require('./appnav.html'),
  props: {
    activeTab: String,
  },
})
export default class AppNav extends Vue {
  activeTab: string;

  activeClass(label: string) {
    return this.activeTab === label ? 'mdc-tab--active' : '';
  }

  refresh() {
    Object.keys(this.$store.state.feeds).forEach((feed_url) =>
      this.$store.dispatch('updateFeed', this.$store.state.feeds[feed_url])
    );
  }

  fileSelected(e: any) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const opmlText = (event.target as any).result;
      const feeds = parseOpml(opmlText);
      feeds.forEach((feed) => this.$store.dispatch('updateFeed', feed));
    };
    reader.readAsText(e.target.files[0]);
  }
}
