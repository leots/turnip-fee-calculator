<template>
  <highcharts :options="chartOptions"></highcharts>
</template>

<script>
import { Chart } from 'highcharts-vue';

export default {
  name: 'TurnipChart',
  components: {
    highcharts: Chart,
  },
  data() {
    return {
      chartOptions: {
        xAxis: {
          title: {
            text: 'Selling fee',
          },
        },
        yAxis: {
          title: {
            text: 'Turnip price',
          },
        },
        series: [{
          data: [1, 2, 3], // sample data
        }],
      },
    };
  },
};
</script>

<style scoped>

</style>
