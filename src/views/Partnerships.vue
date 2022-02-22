<template>
  <div class="wrap">
    <EnterpriseLine :options="lineData" />
    <br />
    <EnterpriseTreemap :options="treeData" />
  </div>
</template>

<script setup>
import EnterpriseLine from '../components/EnterpriseLine.vue';
import EnterpriseTreemap from '../components/EnterpriseTreemap.vue';
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

<style lang="scss" scoped></style>
