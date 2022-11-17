<script lang="ts" setup>
import { ref, watch } from 'vue';
import { cloneDeep } from 'lodash-es';
import { useI18n } from 'vue-i18n';
import { IObject } from 'shared/@types/interface';
import { ElScrollbar } from 'element-plus';
import { Search } from '@element-plus/icons-vue';

const { t } = useI18n();
const props = defineProps({
  data: {
    type: Array as () => IObject[],
    default: () => [],
  },
  value: {
    type: String,
    default: '',
  },
});

// 搜索过滤
const searchInput = ref('');
const reallData = ref([] as IObject[]);
const initReallData = () => {
  reallData.value = cloneDeep(props.data);
};

watch(
  () => props.data,
  () => {
    initReallData();
  },
  { deep: true }
);
watch(
  () => props.value,
  (val) => getLabel(val)
);
const getLabel = (val?: string) => {
  if (val) {
    sencondTitle.value =
      reallData.value.find((item) => item.value === val)?.label || val;
  } else {
    sencondTitle.value = reallData.value[0]?.label;
  }
};
// 顶部选择
const sencondTitle = ref('');
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>();
const inputSlider = (value: number) => {
  scrollbarRef.value?.setScrollTop(value);
};
const showDropdown = (e: any) => {
  if (e) {
    let number = 0;
    reallData.value.forEach((item: any, index) => {
      if (item.label === sencondTitle.value) {
        number = index;
      }
    });
    inputSlider(number * 32);
  }
};

const querySearch = () => {
  if (searchInput.value !== '') {
    const newList = props.data.filter((item: any) =>
      item.label.toLowerCase().includes(searchInput.value)
    );
    reallData.value = newList;
  } else {
    initReallData();
  }
};
// 清除搜索
const clearSearchInput = () => {
  clean();
};
const clean = () => {
  searchInput.value = '';
};
const emit = defineEmits(['update:value']);

const clickDrownItem = (item: IObject) => {
  clean();
  initReallData();
  emit('update:value', item.value);
};
</script>

<template>
  <div>
    <el-dropdown
      trigger="click"
      placement="bottom-start"
      @visible-change="showDropdown"
    >
      <div class="title">
        <span :title="sencondTitle">{{ sencondTitle }}</span>
        <span class="btnc"></span>
      </div>
      <template #dropdown>
        <div class="searchInput">
          <el-input
            v-model="searchInput"
            clearable
            :debounce="300"
            class="w-50 m-2"
            :placeholder="t('enterName')"
            :prefix-icon="Search"
            @input="querySearch"
            @clear="clearSearchInput"
          />
        </div>

        <el-scrollbar ref="scrollbarRef" always height="400px">
          <el-dropdown-item
            v-for="item in reallData"
            :key="item.value"
            class="dropdownItem"
            @click="clickDrownItem(item)"
          >
            {{ item.label }}</el-dropdown-item
          >
        </el-scrollbar>
      </template>
    </el-dropdown>
  </div>
</template>
<style lang="scss" scoped>
.title {
  font-size: 18px;
  font-family: HarmonyOS_Sans_SC_Medium;
  color: #7D32EA;
  font-weight: 500;
  height: 1.5rem;
  line-height: 1.5rem;
  text-overflow: ellipsis;
  width: 100vw;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  .btnc {
    background-image: url('@/assets/down.png');
    width: 24px;
    height: 24px;
    position: absolute;
    right: 1rem;
  }
}
.searchInput {
  width: 350px;
  margin: 10px;
  .search-icon {
    font-size: 20px;
  }
  :deep(.el-autocomplete) {
    width: 100%;
    &.active .el-input__inner {
      box-shadow: 0 0 0 1px #7D32EA inset;
    }
  }
  :deep(.el-input__prefix) {
    left: 12px;
    align-items: center;
  }
  @media screen and (min-width: 900px) {
    :deep(.el-input__inner) {
      padding-left: 40px;
    }
  }
  @media screen and (max-width: 900px) {
    :deep(.el-input__prefix) {
      left: 10px;
    }
  }
  :deep(.el-input__inner:focus) {
    box-shadow: 0 0 0 1px #7D32EA inset;
  }
}
</style>
