import Vue from 'vue';
import Component from 'vue-class-component';

import {parseOpml} from '../../lib/feedManager';

import Slider from './components/slider/slider';

@Component({
  template: require('./appnav.html'),
  props: {
    activeTab: String,
    showPrimaryActionButton: {
      type: Boolean,
      default: true,
    },
  },
  components: {Slider},
})
export default class AppNav extends Vue {
  activeTab: string;
  showPrimaryActionButton: boolean;

  activeClass(label: string) {
    return this.activeTab === label ? 'mdc-tab--active' : '';
  }

  get primaryActionIcon() {
    return this.$store.state.player.playing ? 'pause' : 'play_arrow';
  }

  togglePlayPause() {
    this.$store.commit('togglePlayPause');
    this.$router.push({name: 'nowPlaying'});
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

  seekBackward() {
    this.$store.dispatch('skipToTimestamp', this.$store.state.player.timestamp - 30);
  }
  seekForward() {
    this.$store.dispatch('skipToTimestamp', this.$store.state.player.timestamp + 30);
  }

  get sliderValue(): number {
    return this.$store.state.player.timestamp;
  }
  get sliderMin(): number {
    return 0;
  }
  get sliderMax(): number {
    const episode = this.$store.state.player.episode;
    return episode ? (episode.duration || 0) : 0;
  }

  onSlideInput(newTimestamp: number) {
    this.$store.commit('updatePlayedTimestamp', newTimestamp);
  }

  onSlideChange(newTimestamp: number) {
    this.$store.dispatch('skipToTimestamp', newTimestamp);
  }
}
