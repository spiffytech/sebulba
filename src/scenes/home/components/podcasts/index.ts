import Vue from 'vue';
import Component from 'vue-class-component';

import store from '../../../../store';

@Component({
  template: require('./index.html')
})
export default class Podcast extends Vue {
  get feeds() {
    return this.$store.state.feeds;
  }
}
