import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
  template: require('./playlist.html'),
  props: {
  }
})
export default class Playlist extends Vue {
  get episodes() {
    return this.$store.getters.playlist;
  }
}
