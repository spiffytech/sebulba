import Vue from 'vue';
import Component from 'vue-class-component';

const mdc = require('material-components-web');

@Component({
  template: require('./slider.html'),
  props: {
    min: Number,
    value: Number,
    max: Number,
  },
  components: {},
})
export default class Slider extends Vue {
  min: number;
  value: number;
  max: number;

  mounted() {
    const ref = this.$refs.slider;
    const discreteSlider = new mdc.slider.MDCSlider(ref);

    discreteSlider.listen('MDCSlider:input', () => {
      this.$emit('input', discreteSlider.value);
    });
    discreteSlider.listen('MDCSlider:change', () => {
      this.$emit('change', discreteSlider.value);
    });
  }
}
