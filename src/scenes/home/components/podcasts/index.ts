import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
  template: require('./index.html'),
})
export default class Podcasts extends Vue {
  get feeds() {
    return this.$store.state.feeds;
  }
}
