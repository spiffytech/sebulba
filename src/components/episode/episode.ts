import Vue from 'vue';
import Component from 'vue-class-component';

import {Podcast, Episode} from '../../lib/types';

@Component({
  template: require('./episode.html'),
  props: {
    podcast: Object,
    episode: Object,
  }
})
export default class EpisodeView extends Vue {
  podcast: Podcast;
  episode: Episode;
}
