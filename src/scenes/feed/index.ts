import Vue from 'vue';
import Component from 'vue-class-component';

import Podcast from '../../components/podcast';

@Component({
  template: require('./index.html'),
  props: {
    id: String,
  },
  components: {Podcast},
})
export default class Feed extends Vue {
  id: string;

  get feed() {
    return this.$store.state.feeds[this.id];
  }

  get items() {
    return this.$store.state.items[this.id];
  }
}
