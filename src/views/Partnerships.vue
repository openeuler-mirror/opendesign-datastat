<script setup>
import LinePartnershipsTotal from '../components/charts/LinePartnershipsTotal.vue';
import TreemapPartnershipsDevelopers from '../components/charts/TreemapPartnershipsDevelopers.vue';
import { ref } from 'vue';
const lineData = ref({
  optData: [0, 1, 6, 20, 46, 122, 352],
});
const treeData = ref({
  color: ['#0A2255', '#A08DFC', '#103F30', '#4ECD8F', '#54DBDA'],
  seriesData: [
    {
      name: 'nodeB',
      value: 50,
      label: 'xxxxxxx1',
      children: [
        {
          name: 'nodeC',
          value: 25,
          children: [
            {
              name: 'nodeE',
              value: 25,
              children: [
                {
                  name: 'nodeB',
                  value: 15,
                  //   itemStyle: {
                  //     color: color[3],
                  //   },
                },
                {
                  name: 'nodeB',
                  value: 8,
                  //   itemStyle: {
                  //     color: color[4],
                  //   },
                },
              ],
            },
            {
              name: 'nodeD',
              value: 25,
              //   itemStyle: {
              //     color: color[2],
              //   },
            },
          ],
        },
        {
          name: 'nodeB',
          value: 25,
          //   itemStyle: {
          //     color: color[1],
          //   },
        },
      ],
    },
    {
      name: 'nodeA',
      label: 'xxxxxxx0',
      value: 50,
      //   itemStyle: {
      //     color: color[0],
      //   },
    },
  ],
});
</script>

<template>
  <div class="wrap">
    <line-partnerships-total :options="lineData" />
    <br />
    <div class="partnerships-developers">
      <h3 class="title">合作企业开发者数量占比</h3>
      <treemap-partnerships-developers :options="treeData" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.partnerships-developers {
  margin-top: 40px;
  .title {
    font-size: 18px;
    margin-bottom: 20px;
  }
}
</style>
