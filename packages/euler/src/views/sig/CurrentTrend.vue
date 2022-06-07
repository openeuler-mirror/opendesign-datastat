<script setup lang="ts">
import OPolar from 'shared/components/OPolar.vue';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { IObject } from 'shared/@types/interface';

const { t } = useI18n();
</script>
<template>
  <div class="polar">
    <o-polar id="curEchartPolar"></o-polar>
  </div>
</template>
<style lang="scss" scoped>
.polar {
  display: inline-block;
  width: 350px;
}
</style>
