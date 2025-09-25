<script setup lang="ts">
import { ORadio, ORadioGroup, OToggle } from '@opensig/opendesign';
import { useVModel } from '@vueuse/core';

const props = defineProps<{
  modelValue: string | number;
  options: { label: string; value: string | number; }[]
}>();

const emit = defineEmits(['update:modelValue', 'change'])

const vmodelValue = useVModel(props, 'modelValue', emit);

const onChange = (...args: any[]) => emit('change', ...args)
</script>

<template>
  <ORadioGroup v-model="vmodelValue" style="--radio-group-gap: 8px" @change="onChange">
    <ORadio v-for="item in options" :key="item.value" :value="item.value">
      <template #radio="{ checked }">
        <OToggle :checked="checked">{{ item.label }}</OToggle>
      </template>
    </ORadio>
  </ORadioGroup>
</template>