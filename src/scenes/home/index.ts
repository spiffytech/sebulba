import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
  template: require('./index.html')
})
export default class Home extends Vue {
  get path() {
    return this.$store.state;
  }
  mounted() {
    alert('mounted!');
  }
}
