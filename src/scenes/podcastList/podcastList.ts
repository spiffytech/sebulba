import Vue from 'vue';
import Component from 'vue-class-component';

import AppNav from '../../components/appnav/appnav';

@Component({
  template: require('./podcastList.html'),
  components: {AppNav},
})
export default class PodcastList extends Vue {
  get podcasts() {
    return this.$store.state.podcasts;
  }
}
