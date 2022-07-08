<template>
  <div class="desc" :style="{ marginTop }">
    {{ t('ViewOnPC1') }}<br />{{ t('ViewOnPC2') }}
  </div>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
defineProps({
  marginTop: {
    type: String,
    default: '1rem',
  },
});
</script>
<style scoped lang="scss">
.desc {
  text-align: center;
  font-size: 12px;
  line-height: 1.2rem;
}
</style>
