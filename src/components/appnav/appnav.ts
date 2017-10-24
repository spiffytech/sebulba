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

  get showPrimaryActionButton() {
    return Boolean(this.$store.state.player.episode);
  }

  get primaryActionIcon() {
    return this.$store.state.player.playing ? 'play_arrow' : 'pause';
  }

  togglePlayPause() {
    this.$store.dispatch('togglePlayPause');
  }

  refresh() {
    Object.keys(this.$store.state.podcasts).forEach((podcastUrl) =>
      this.$store.dispatch('updatePodcast', this.$store.state.podcasts[podcastUrl])
    );
  }

  fileSelected(e: any) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const opmlText = (event.target as any).result;
      const podcasts = parseOpml(opmlText);
      podcasts.forEach((podcast) => this.$store.dispatch('updatePodcast', podcast));
    };
    reader.readAsText(e.target.files[0]);
  }
}
